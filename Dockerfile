FROM node:19.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g prisma

RUN prisma generate

COPY prisma/schema.prisma ./prisma/

EXPOSE 3000

CMD [ "npm", "start" ]