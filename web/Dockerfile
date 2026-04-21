FROM node:22-alpine AS build

ARG VITE_POCKETBASE_URL
RUN corepack enable

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

FROM nginx:alpine
COPY --from=build /usr/src/app/web/dist /usr/share/nginx/html
COPY ./web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]