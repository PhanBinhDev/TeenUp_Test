##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base

# Install and use pnpm
RUN npm install -g pnpm

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

FROM base As development
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Bundle app source
COPY --chown=node:node . .

# Generate JWT keys if not exists
RUN apk add --no-cache openssl && \
  mkdir -p secrets && \
  if [ ! -f secrets/private.key ]; then \
  openssl genpkey -algorithm RSA -out secrets/private.key -pkeyopt rsa_keygen_bits:4096 && \
  openssl rsa -pubout -in secrets/private.key -out secrets/public.key && \
  chown -R node:node secrets; \
  fi

# Copy entrypoint script and ensure Unix line endings
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
  dos2unix /usr/local/bin/docker-entrypoint.sh 2>/dev/null || sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh

# Use the node user from the image (instead of the root user)
USER node

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["pnpm", "run", "start:dev"]

#####################
# BUILD BUILDER IMAGE
#####################

FROM base AS builder
WORKDIR /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/src ./src
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /app/tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node --from=development /app/nest-cli.json ./nest-cli.json

RUN pnpm build

# Removes unnecessary packages adn re-install only production dependencies
ENV NODE_ENV production
RUN pnpm prune --prod
RUN pnpm install --prod

USER node

######################
# BUILD FOR PRODUCTION
######################

FROM node:20-alpine AS production
WORKDIR /app

# Install PM2 globally and other dependencies
RUN npm install -g pm2
RUN mkdir -p src/generated && chown -R node:node src
RUN mkdir -p /app/secrets && chown -R node:node /app/secrets
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
RUN apk add --no-cache openssl wget

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node pm2.config.json ./

# Generate JWT keys during build
RUN if [ ! -f /app/secrets/private.key ]; then \
  openssl genpkey -algorithm RSA -out /app/secrets/private.key -pkeyopt rsa_keygen_bits:4096 && \
  openssl rsa -pubout -in /app/secrets/private.key -out /app/secrets/public.key && \
  chown -R node:node /app/secrets; \
  fi

# Copy entrypoint script and ensure Unix line endings
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
  sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh 2>/dev/null || true

USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["pm2-runtime", "start", "pm2.config.json"]
