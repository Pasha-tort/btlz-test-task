FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./

# ENTRYPOINT ["sh", "-c", "npm install && npm run dev"]

FROM node:20-alpine AS deps-prod

WORKDIR /app

COPY ./package*.json .

RUN npm ci --omit=dev

FROM deps-prod AS build

RUN npm ci --include=dev

COPY . .

RUN npm run build

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app/service-account-key.json .
COPY --from=build /app/package*.json .
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/configs ./configs