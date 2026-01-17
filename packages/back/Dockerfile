# packages/back/Dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock* /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy source and build
FROM base AS build
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Production image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/package.json .

# Créer le dossier pour la DB
RUN mkdir -p /app/src/server

# Exposer le port
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run --bun src/index.ts || exit 1

# Lancer l'application
CMD ["bun", "run", "src/index.ts"]
