# Estágio 1: Build do Frontend (React/Vite)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Isto vai gerar a pasta /app/dist
RUN npm run build 

# Estágio 2: Produção (Node.js/Express)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
# Copiar o backend
COPY server.js ./
# Copiar o frontend compilado do Estágio 1
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]
