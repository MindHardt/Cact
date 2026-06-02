FROM node:24-slim AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml ./

COPY shared ./shared
COPY web ./web

RUN pnpm install --frozen-lockfile
RUN pnpm --fail-if-no-match --filter=cact-shared run build

ARG VITE_API_URL
RUN pnpm --fail-if-no-match --filter=cact-web run build


FROM nginx:alpine
COPY --from=build /app/web/dist /usr/share/nginx/html
COPY ./web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]