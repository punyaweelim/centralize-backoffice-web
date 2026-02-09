#!/bin/sh
set -e

# Create Vault secrets directory
mkdir -p /vault/secrets

# Wait for Vault to inject runtime-config.json (max 30 seconds)
VAULT_CONFIG="/vault/secrets/runtime-config.json"
TIMEOUT=30
ELAPSED=0

while [ ! -f "$VAULT_CONFIG" ] && [ $ELAPSED -lt $TIMEOUT ]; do
  echo "Waiting for Vault to inject config... ($ELAPSED/$TIMEOUT s)"
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

# If Vault injected the config, use it; otherwise generate from env vars
if [ ! -f "$VAULT_CONFIG" ]; then
  echo "Vault config not found, generating from environment variables"
  cat > "$VAULT_CONFIG" << EOF
{
  "APP_USER_API_URL": "${APP_USER_API_URL:-http://localhost:3000}",
  "ENVIRONMENT": "${NODE_ENV:-development}",
  "ENABLE_DEBUG": "${ENABLE_DEBUG:-false}"
}
EOF
else
  echo "Vault config loaded successfully"
fi

# Copy to nginx public directory so it can be served
cp "$VAULT_CONFIG" /usr/share/nginx/html/runtime-config.json

# Start Nginx
exec nginx -g "daemon off;"
