#!/bin/bash

# Configuration
DEPLOYMENT_DESC="Production"
MAX_DEPLOYMENTS=45

echo "Starting smart deployment for Apps Script..."

# Move to the API directory where .clasp.json is located
cd apps/api

# 1. Push code
echo "Deploying to script ID from .clasp.json..."
npx @google/clasp push --force

# 2. Find existing production deployment
echo "Checking for existing '$DEPLOYMENT_DESC' deployment..."
DEPLOYMENTS=$(npx @google/clasp deployments)
PROD_ID=$(echo "$DEPLOYMENTS" | grep "$DEPLOYMENT_DESC" | head -n 1 | awk '{print $2}')

if [ -n "$PROD_ID" ]; then
    echo "Found existing production deployment: $PROD_ID"
    echo "Updating deployment..."
    npx @google/clasp deploy -i "$PROD_ID" -d "$DEPLOYMENT_DESC"
else
    echo "No production deployment found. Creating new one..."
    # Capture the output of deploy to get the new ID
    DEPLOY_OUTPUT=$(npx @google/clasp deploy -d "$DEPLOYMENT_DESC")
    echo "$DEPLOY_OUTPUT"
    PROD_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE "AKfycb[a-zA-Z0-9_-]+" | head -n 1)
    
    if [ -z "$PROD_ID" ]; then
        echo "Error: Failed to capture new deployment ID"
        exit 1
    fi
    echo "Created new production deployment: $PROD_ID"
fi

# 3. Handle limit (Cleanup old deployments)
COUNT=$(echo "$DEPLOYMENTS" | grep -c "^-")
echo "Current deployment count: $COUNT"

if [ "$COUNT" -gt "$MAX_DEPLOYMENTS" ]; then
    echo "Deployment count exceeds $MAX_DEPLOYMENTS. Cleaning up oldest deployments..."
    # Get all IDs except the one we just updated/created and the @HEAD one
    # We sort by date (implicit in the list output usually, but risky)
    # Better: just undeploy anything that isn't our PROD_ID and isn't @HEAD
    OLD_IDS=$(echo "$DEPLOYMENTS" | grep "^-" | grep -v "$PROD_ID" | grep -v "@HEAD" | tail -n +5 | awk '{print $2}')
    
    for ID in $OLD_IDS; do
        echo "Undeploying $ID..."
        npx @google/clasp undeploy "$ID"
    done
fi

# 4. Output for GitHub Actions
if [ -n "$GITHUB_OUTPUT" ]; then
    echo "deployment_id=$PROD_ID" >> "$GITHUB_OUTPUT"
    echo "api_url=https://script.google.com/macros/s/$PROD_ID/exec" >> "$GITHUB_OUTPUT"
fi

echo "Done! Final Production ID: $PROD_ID"
