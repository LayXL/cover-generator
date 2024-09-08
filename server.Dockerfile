FROM oven/bun:alpine

WORKDIR /usr/local

RUN apk add libstdc++

COPY bun.lockb .
COPY package.json .
COPY apps ./apps
COPY packages ./packages

RUN bun install

WORKDIR /usr/local/apps/server

ENTRYPOINT ["bun", "src/index.ts"]