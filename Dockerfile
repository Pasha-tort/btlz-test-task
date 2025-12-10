FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:20-alpine AS deps-prod

WORKDIR /app

COPY ./package*.json .

RUN npm ci --omit=dev

FROM deps-prod AS build

RUN npm ci --include=dev

COPY . .

RUN rm -rf dist && npm run build

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app/package*.json .
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/config ./config
COPY --from=build /app/service-account-key.json ./service-account-key.json