FROM node:16

WORKDIR /src

COPY package.json ./
COPY package-lock.json ./

RUN rm -rf node_modules

RUN npm install
RUN npm i react-scripts
RUN npm rebuild node-sass

COPY . ./

EXPOSE 3000 

CMD ["npm", "start"]