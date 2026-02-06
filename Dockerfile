# ---------- Stage 1: Builder ----------
FROM node:24-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# Vite build outputs to /build per your config
RUN npm run build

# ---------- Stage 2: Runner (Production/Nginx) ----------
FROM nginx:stable-alpine AS runner

# Create the directory for Vault to inject secrets into if needed
RUN mkdir -p /usr/share/nginx/html/config

# Copy build artifacts
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# The Vault sidecar will manage the files; Nginx just starts
CMD ["nginx", "-g", "daemon off;"]
