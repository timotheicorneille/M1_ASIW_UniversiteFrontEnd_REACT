# packages/view/Dockerfile
FROM oven/bun:1 as build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json bun.lock* ./

# Installer les dépendances
RUN bun install --frozen-lockfile

# Copier le code source
COPY . .

# Argument pour l'URL de l'API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de production
RUN bun run build

# Stage de production avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
