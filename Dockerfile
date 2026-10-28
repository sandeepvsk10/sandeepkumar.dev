# Build with Bun, then serve static files on Cloud Run's PORT (default 8080).
FROM oven/bun:1.4.3 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginxinc/nginx-unprivileged:stable-alpine AS runner
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
ENV PORT=8080
EXPOSE 8080
