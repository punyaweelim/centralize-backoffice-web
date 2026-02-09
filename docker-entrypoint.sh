#!/bin/sh
set -e

# Create Vault secrets directory
mkdir -p /vault/secrets

# Generate runtime config as JSON (not exposed to window object)
if [ ! -f /vault/secrets/runtime-config.json ]; then
    cat > /vault/secrets/runtime-config.json << EOF
{
  "APP_USER_API_URL": "${APP_USER_API_URL:-http://localhost:3000}",
  "ENVIRONMENT": "${NODE_ENV:-development}",
  "ENABLE_DEBUG": "${ENABLE_DEBUG:-false}"
}
EOF
fi

# Copy to nginx public directory so it can be served
cp /vault/secrets/runtime-config.json /usr/share/nginx/html/

# Start Nginx
exec nginx -g "daemon off;"
