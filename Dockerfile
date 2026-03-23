#imagen base oficial de node
FROM node:20-alpine

#creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

#copiamos primero los archivos de dependencias para aprovechar el cache de docker
COPY package*.json ./

#instalamos dependencias necesarias para producción
RUN npm ci --omit=dev

#copiamos el resto del proyecto
COPY . .

#creamos la carpeta de logs que usa winston
RUN mkdir -p src/logs/errors

#informamos el puerto en el que escucha la app dentro del contenedor

EXPOSE 3000

#variables de entorno por defecto

ENV NODE_ENV=production
ENV PORT=3000

#comando principal del contenedor
CMD ["npm", "start"]