FROM oven/bun:alpine as build-stage

WORKDIR /usr/local

COPY bun.lockb .
COPY package.json .

COPY apps/client/package.json ./apps/client/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/drizzle/package.json ./packages/drizzle/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN bun install

COPY apps ./apps
COPY packages ./packages

WORKDIR /usr/local/apps/client

RUN bun run build

# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /usr/src/build/.config/nginx-build.conf /etc/nginx/nginx.conf
# COPY --from=build-stage /usr/src/build/web-build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]