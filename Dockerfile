FROM node:16

RUN npm install --global nodemon

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
