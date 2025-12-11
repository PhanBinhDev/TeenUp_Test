#!/bin/sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}TeenUp Backend - Starting...${NC}"

# Generate JWT keys if not exists
if [ ! -f "/app/secrets/private.key" ] || [ ! -f "/app/secrets/public.key" ]; then
  echo "${YELLOW}JWT keys not found. Generating new keys...${NC}"
  
  # Create secrets directory if not exists
  mkdir -p /app/secrets
  
  # Generate RSA 4096-bit keys
  openssl genpkey -algorithm RSA -out /app/secrets/private.key -pkeyopt rsa_keygen_bits:4096
  openssl rsa -pubout -in /app/secrets/private.key -out /app/secrets/public.key
  
  # Set proper permissions
  chmod 600 /app/secrets/private.key
  chmod 644 /app/secrets/public.key
  
  echo "${GREEN}JWT keys generated successfully${NC}"
else
  echo "${GREEN}JWT keys already exist${NC}"
fi

# Execute the main command
echo "${GREEN}Starting application...${NC}"
exec "$@"
