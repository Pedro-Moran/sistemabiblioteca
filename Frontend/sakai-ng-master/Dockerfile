# Stage 1: compila tu app Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
RUN npm run build -- --configuration production

# Stage 2: sirve con Nginx
FROM nginx:stable-alpine

# 1) Borra el contenido web por defecto
RUN rm -rf /usr/share/nginx/html/*

# 2) Copia la config SPA (try_files ...)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3) Copia sólo el build cliente que está en 'browser'
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
