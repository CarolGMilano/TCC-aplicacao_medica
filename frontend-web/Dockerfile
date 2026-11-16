
# Etapa 1: compilar o Angular
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration=production,docker

# Etapa 2: servir com Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/frontend-web/browser /usr/share/nginx/html

EXPOSE 80
