FROM focker.ir/node:lts-alpine

WORKDIR /app

COPY package.json .

COPY .env .

COPY . .

RUN yarn install

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run","start"]