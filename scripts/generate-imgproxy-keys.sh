#!/usr/bin/env bash
# Generate IMGPROXY_KEY and IMGPROXY_SALT for local development.
# Writes (or updates) the vars in your .env file so docker compose picks them up.
set -euo pipefail

ENV_FILE="${1:-.env}"

KEY=$(openssl rand -hex 32)
SALT=$(openssl rand -hex 32)

echo "IMGPROXY_KEY=$KEY"
echo "IMGPROXY_SALT=$SALT"

if [ -f "$ENV_FILE" ]; then
  # Update existing keys in-place (macOS-compatible sed)
  if grep -q "^IMGPROXY_KEY=" "$ENV_FILE"; then
    sed -i '' "s/^IMGPROXY_KEY=.*/IMGPROXY_KEY=$KEY/" "$ENV_FILE"
  else
    echo "IMGPROXY_KEY=$KEY" >> "$ENV_FILE"
  fi
  if grep -q "^IMGPROXY_SALT=" "$ENV_FILE"; then
    sed -i '' "s/^IMGPROXY_SALT=.*/IMGPROXY_SALT=$SALT/" "$ENV_FILE"
  else
    echo "IMGPROXY_SALT=$SALT" >> "$ENV_FILE"
  fi
  echo "→ Updated $ENV_FILE"
else
  echo "IMGPROXY_KEY=$KEY" > "$ENV_FILE"
  echo "IMGPROXY_SALT=$SALT" >> "$ENV_FILE"
  echo "→ Created $ENV_FILE"
fi
