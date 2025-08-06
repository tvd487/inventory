# Dockerfile for Next.js production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
ENV NEXT_DISABLE_ESLINT_PLUGIN=true
RUN apk add --no-cache netcat-openbsd
RUN npm install --frozen-lockfile
RUN npm run build -- --no-lint

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
RUN npm install --production --frozen-lockfile
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/docker-entrypoint.sh"]
