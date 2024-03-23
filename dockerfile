FROM node:20-alpine3.19 AS dependencies

WORKDIR /src/app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
