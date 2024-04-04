FROM node:20.10.0-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start:dev"]