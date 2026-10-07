FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies needed for native modules, curl for healthcheck
RUN apk add --no-cache openssl libc6-compat curl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN chmod +x ./docker-entrypoint.sh
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]
