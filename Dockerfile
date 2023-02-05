FROM node:latest
WORKDIR /app

COPY package*.json ./

RUN npm install --global yarn
RUN npm install
RUN npm install react-scripts

COPY . ./

#Start the app
CMD ["npm", "start"]
