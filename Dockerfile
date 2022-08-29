FROM node:16

RUN npm install --global nodemon
RUN npm install --global knex
RUN npm install --global dotenv

WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
