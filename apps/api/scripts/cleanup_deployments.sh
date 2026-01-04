#!/bin/bash
# cleanup_deployments.sh

# Get all deployments
DEPLOYMENTS=$(npx clasp deployments)

# Keep the one marked "Production" and the @HEAD one
# Production ID: AKfycbwe8KLexn483LNVGM9orL0GQtK3eqh3N_KsHxTX62xb81Hghe3mGuyBJBo_W2_YDaeS

KEEP_ID="AKfycbwe8KLexn483LNVGM9orL0GQtK3eqh3N_KsHxTX62xb81Hghe3mGuyBJBo_W2_YDaeS"

echo "Listing deployments to delete..."
IDS=$(echo "$DEPLOYMENTS" | grep "^-" | grep -v "@HEAD" | grep -v "$KEEP_ID" | awk '{print $2}')

for ID in $IDS; do
    echo "Undeploying: $ID"
    npx clasp undeploy $ID
done

echo "Cleanup complete."
