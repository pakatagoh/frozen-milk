# ─── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
# Fix: ensure SSR router references the actual client CSS asset (not independently-built SSR CSS).
# Tailwind v4 + Vite can produce different CSS in SSR vs client builds under Docker,
# causing a FOUC (Flash of Unstyled Content) from a 404 on the mismatched CSS URL.
ARG CACHE_BUST=0
RUN rm -rf node_modules/.vite .output node_modules/.nitro && pnpm build && \
  CLIENT_CSS=$(ls .output/public/assets/styles-*.css | head -1 | xargs basename) && \
  for f in .output/server/_ssr/router-*.mjs; do \
    sed -i "s|/assets/styles-[^.\"]*\\.css|/assets/$CLIENT_CSS|g" "$f"; \
  done

# ─── Production stage ─────────────────────────────────────────
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache python3 make g++

WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/.npmrc ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/.output ./.output

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
