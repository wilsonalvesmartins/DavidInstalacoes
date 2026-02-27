version: '3.8'

services:
  web:
    build: 
      context: .
      dockerfile: Dockerfile
    expose:
      - "3000"
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    volumes:
      # NOVO: Volume mapeado para armazenar os PDFs de contratos e aditivos fisicamente
      - uploads-data:/app/uploads
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    restart: always
    expose:
      - "5432"
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      # CRÍTICO: Volume nomeado para persistência de dados no Coolify
      - pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pg-data:
    name: ${PROJECT_NAME:-portal_contratos}_pg_data
  uploads-data:
    name: ${PROJECT_NAME:-portal_contratos}_uploads
