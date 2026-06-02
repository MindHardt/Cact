FROM node:24-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml ./

COPY shared ./shared
COPY api ./api

RUN pnpm install --frozen-lockfile

RUN pnpm --fail-if-no-match --filter=cact-shared run build
RUN pnpm --fail-if-no-match --filter=cact-api run build

FROM node:24-slim AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_MIGRATIONS_FOLDER=/app/api/dist/.drizzle

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml ./

COPY shared/package.json ./shared/package.json
COPY api/package.json ./api/package.json

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/.drizzle ./api/dist/.drizzle
COPY --from=builder /app/api/src/features/ai-prompts/instructions.md ./api/dist/features/ai-prompts/

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3001

CMD ["node", "api/dist/index.js"]