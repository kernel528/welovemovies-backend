FROM node:22.15.0-bookworm AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/* \
    && npm_config_build_from_source=true npm ci

FROM dependencies AS test

COPY . ./

ENV NODE_ENV=test

RUN npm test -- --runInBand

FROM test AS runtime-dependencies

RUN npm prune --omit=dev

FROM node:22.15.0-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=runtime-dependencies /app/node_modules ./node_modules
COPY knexfile.js ./
COPY images/pans_labyrinth_poster.jpg ./images/pans_labyrinth_poster.jpg
COPY src ./src

USER node

EXPOSE 5001

CMD ["node", "src/server.js"]
