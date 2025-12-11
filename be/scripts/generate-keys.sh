#!/bin/bash

echo "🔑 Generating JWT RSA keys..."

SECRETS_DIR="$(dirname "$0")/../secrets"

# Create secrets directory if not exists
mkdir -p "$SECRETS_DIR"

# Generate private key
if [ ! -f "$SECRETS_DIR/private.key" ]; then
  echo "Generating private key..."
  openssl genpkey -algorithm RSA -out "$SECRETS_DIR/private.key" -pkeyopt rsa_keygen_bits:4096
  echo "Private key generated"
else
  echo "Private key already exists, skipping..."
fi

# Generate public key
if [ ! -f "$SECRETS_DIR/public.key" ]; then
  echo "Generating public key..."
  openssl rsa -pubout -in "$SECRETS_DIR/private.key" -out "$SECRETS_DIR/public.key"
  echo "Public key generated"
else
  echo "Public key already exists, skipping..."
fi

echo ""
echo "JWT keys ready!"
echo "   Private key: $SECRETS_DIR/private.key"
echo "   Public key:  $SECRETS_DIR/public.key"
