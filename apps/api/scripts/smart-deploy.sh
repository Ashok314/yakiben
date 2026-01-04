#!/bin/bash

echo "Starting deployment for Apps Script..."

cd apps/api

# 1. Build
echo "Building..."
npm run build || exit 1

# 2. Push code
echo "Pushing code..."
npx @google/clasp push --force || exit 1

# 3. Try to deploy
echo "Attempting deployment..."
DEPLOY_OUTPUT=$(npx @google/clasp deploy -d "Production" 2>&1)

# Check if deployment failed due to limit
if echo "$DEPLOY_OUTPUT" | grep -q "may only have up to"; then
    echo "Deployment limit reached. Cleaning up old deployments..."
    
    # Get all deployments
    DEPLOYMENTS=$(npx @google/clasp deployments)
    
    # Extract all deployment IDs (excluding @HEAD)
    ALL_IDS=$(echo "$DEPLOYMENTS" | grep "^-" | grep -v "@HEAD" | awk '{print $2}')
    
    # Count total deployments
    TOTAL=$(echo "$ALL_IDS" | wc -l | tr -d ' ')
    
    if [ "$TOTAL" -gt 2 ]; then
        # Keep only the last 2, delete the rest
        TO_DELETE=$(echo "$ALL_IDS" | head -n $(($TOTAL - 2)))
        
        for ID in $TO_DELETE; do
            echo "Deleting deployment: $ID"
            npx @google/clasp undeploy "$ID"
        done
    fi
    
    # Retry deployment
    echo "Retrying deployment..."
    DEPLOY_OUTPUT=$(npx @google/clasp deploy -d "Production")
fi

echo "$DEPLOY_OUTPUT"

# Extract the new deployment ID
NEW_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE "AKfycb[a-zA-Z0-9_-]+" | head -n 1)

if [ -z "$NEW_ID" ]; then
    echo "ERROR: Failed to extract deployment ID"
    exit 1
fi

API_URL="https://script.google.com/macros/s/$NEW_ID/exec"

echo "------------------------------------------------"
echo "DEPLOYMENT SUCCESSFUL"
echo "New Deployment ID: $NEW_ID"
echo "API URL: $API_URL"
echo "------------------------------------------------"

# 4. Output for GitHub Actions (if running in CI)
if [ -n "$GITHUB_OUTPUT" ]; then
    echo "deployment_id=$NEW_ID" >> "$GITHUB_OUTPUT"
    echo "api_url=$API_URL" >> "$GITHUB_OUTPUT"
    echo "Exported to GitHub Actions outputs"
fi

# 5. Update .env files ONLY in local development (not in CI)
if [ -z "$CI" ]; then
    echo ""
    echo "Updating local .env files..."
    
    echo "VITE_API_URL=$API_URL" > ../customer/.env
    echo "✓ Updated apps/customer/.env"
    
    echo "VITE_API_URL=$API_URL" > ../admin/.env
    echo "✓ Updated apps/admin/.env"
    
    echo ""
    echo "⚠️  Please restart your dev servers to pick up the new URL."
else
    echo ""
    echo "Running in CI - skipping .env file updates"
    echo "Use the deployment_id and api_url outputs in your workflow"
fi

echo ""
echo "Done!"
