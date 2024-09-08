FROM oven/bun:alpine

WORKDIR /usr/local

RUN apt-get install lib32stdc++6

COPY bun.lockb .
COPY package.json .
COPY apps ./apps
COPY packages ./packages

RUN bun install

WORKDIR /usr/local/apps/server

ENTRYPOINT ["bun", "src/index.ts"]