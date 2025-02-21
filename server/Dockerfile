# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
# Set the environment variable to skip postinstall
ENV SKIP_POSTINSTALL=true

COPY package*.json ./
RUN npm install --production && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/server/build ./build
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "build/index.js"]