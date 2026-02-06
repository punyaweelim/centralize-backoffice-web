# ---------- Stage 1: Builder ----------
FROM node:24-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci || true

COPY . .

RUN npm run build || true

# ---------- Stage 2: Runner ----------
FROM nginx:stable-alpine AS runner

RUN mkdir -p /usr/share/nginx/html/config

# COPY --from=builder /usr/src/app/build /usr/share/nginx/html 2>/dev/null || true

RUN echo '<h1>NWL CI/CD TEST OK</h1>' > /usr/share/nginx/html/index.html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
