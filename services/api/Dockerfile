FROM node:20-alpine
WORKDIR /app

# Копіюємо package.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо prisma schema
COPY ../../prisma ./prisma/

# Генеруємо Prisma client
RUN npx prisma generate

# Копіюємо решту коду
COPY . .

# Білдимо TypeScript
RUN npm run build

EXPOSE $PORT

# Запускаємо міграцію І сервер
CMD npx prisma migrate deploy && node dist/server.js
