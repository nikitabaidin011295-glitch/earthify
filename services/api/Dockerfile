FROM node:20-alpine

WORKDIR /app

# Встановлюємо залежності
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Копіюємо Prisma і генеруємо client
COPY prisma ./prisma/
RUN npx prisma generate

# Копіюємо весь код
COPY src ./src/
COPY tsconfig.json ./

# Білдимо
RUN npm run build

# Запускаємо міграцію і сервер
EXPOSE $PORT
CMD npx prisma migrate deploy && node dist/server.js
