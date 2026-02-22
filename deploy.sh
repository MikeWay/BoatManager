#!/bin/bash
# Deploy BoatManager to production server
set -e

SERVER="bitnami@ribmanager.exe-sailing-club.org"
REMOTE_DIR="BoatManager"

echo "==> Deploying to $SERVER..."

ssh "$SERVER" bash <<EOF
  set -e
  cd "$REMOTE_DIR"
  echo "==> Stopping service..."
  sudo systemctl stop boatmanager
  echo "==> Pulling latest code..."
  git pull
  echo "==> Building for production..."
  npm run build-all-prod
  echo "==> Starting service..."
  sudo systemctl start boatmanager
  echo "==> Done. Checking status..."
  sudo systemctl status boatmanager --no-pager
EOF

echo "==> Deployed successfully."
