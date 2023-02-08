FROM node:latest
WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

#Start the app
CMD ["yarn", "start"]
