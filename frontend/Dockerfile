
# ETAPA 1: Compilar Angular
FROM node:22.22.3-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar Angular para producción
RUN npm run build -- --configuration production


# ETAPA 2: Servir Angular con Nginx
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados de Angular
COPY --from=build /app/dist/banco-semillas-frontend/browser /usr/share/nginx/html

# Puerto del servidor web
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
