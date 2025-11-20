# Dockerfile para Railway
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Stage de producción
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y node_modules de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Railway usa la variable PORT automáticamente
# Exponer puerto (Railway asignará uno automáticamente)
EXPOSE $PORT

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]

