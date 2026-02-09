#!/bin/sh
set -e

# Create Vault secrets directory
mkdir -p /vault/secrets

# Generate runtime config if it doesn't exist (for development/testing)
if [ ! -f /vault/secrets/runtime-config.js ]; then
    cat > /vault/secrets/runtime-config.js << 'EOF'
window.APP_CONFIG = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
};
EOF
fi

# Start Nginx
exec nginx -g "daemon off;"
