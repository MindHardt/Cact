FROM node:24-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем корневые конфиги pnpm и lock-файл
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Копируем только исходники нужных пакетов (shared и api)
COPY shared ./shared
COPY api ./api

# Устанавливаем ВСЕ зависимости (и dev, и prod), чтобы скомпилировать shared и api
RUN pnpm install --frozen-lockfile

# Собираем shared (он нужен для api)
RUN pnpm --fail-if-no-match --filter=cact-shared run build

# Собираем api
RUN pnpm --fail-if-no-match --filter=cact-api run build

# ============ Production-образ ============
FROM node:24-slim AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_MIGRATIONS_FOLDER=/app/api/dist/.drizzle

WORKDIR /app

# Копируем корневые файлы pnpm (нужны для установки)
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Копируем package.json пакетов (pnpm install будет смотреть на них)
COPY shared/package.json ./shared/package.json
COPY api/package.json ./api/package.json

# Копируем скомпилированные файлы (результаты сборки)
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/.drizzle ./api/dist/.drizzle

# Устанавливаем ТОЛЬКО production-зависимости.
# Pnpm сама разрешит workspace-зависимости, используя локальные файлы shared/dist и package.json.
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3001

CMD ["node", "api/dist/index.js"]