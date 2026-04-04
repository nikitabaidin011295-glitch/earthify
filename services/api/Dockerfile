FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

EXPOSE $PORT

CMD npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js
