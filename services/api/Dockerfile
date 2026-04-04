FROM node:20-alpine

WORKDIR /app

# Cache bust - змінюй цю цифру щоб скинути кеш
ARG CACHE_BUST=2

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY prisma ./prisma/
RUN npx prisma generate

COPY src ./src/
COPY tsconfig.json ./

RUN npm run build

EXPOSE $PORT
CMD npx prisma migrate deploy && node dist/server.js
