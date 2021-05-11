FROM node:14.16.1-alpine3.12

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run","start"]