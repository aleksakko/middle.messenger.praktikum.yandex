# Dockerfile для PROD docker image 
# необходимо предварительно сделать npm run build и убрать dist/ из .dockerignore

FROM node:18.12.1-alpine

WORKDIR /messenger

COPY package.json ./
COPY server.js ./
COPY dist ./dist

RUN npm install --production

EXPOSE 3000

CMD npm run start
