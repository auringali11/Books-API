FROM node:16.13

WORKDIR /app
COPY package.json .
RUN apt-get update

RUN npm i

RUN npm install -g nodemon

WORKDIR /app
COPY . .
RUN chown node:node .
EXPOSE 5000

CMD ["yarn", "devStart"]