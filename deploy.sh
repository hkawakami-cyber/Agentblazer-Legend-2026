#!/bin/bash
# Salesforce Flow deploy script
# Run this on your LOCAL machine (not in the Claude Code remote environment)

set -e

ORG_ALIAS="trailhead-dev"
INSTANCE_URL="https://enmish42-dev-ed.develop.my.salesforce.com"
USERNAME="yyyhkawakami@enmish.co.jp"

echo "=== Salesforce Flow Deployment ==="
echo ""

# Check if sf CLI is installed
if ! command -v sf &> /dev/null; then
  echo "ERROR: Salesforce CLI (sf) not found."
  echo "Install it from: https://developer.salesforce.com/tools/salesforcecli"
  exit 1
fi

# Login
echo "Logging in to Salesforce org..."
sf org login web \
  --instance-url "$INSTANCE_URL" \
  --alias "$ORG_ALIAS"

# Deploy flows
echo ""
echo "Deploying flows..."
sf project deploy start \
  --source-dir force-app/main/default/flows \
  --target-org "$ORG_ALIAS" \
  --wait 10

echo ""
echo "=== Deploy complete ==="
echo "Two flows deployed:"
echo "  1. Get Contact's Upcoming Bookings"
echo "  2. Cancel Contact's Booking"
echo ""
echo "Both flows are Active. You can now check the Trailhead challenge."
