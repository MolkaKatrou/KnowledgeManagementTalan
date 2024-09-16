FROM node:16

WORKDIR /src

COPY package.json ./

RUN npm install

COPY . .

ENV MONGO_DB=myFirstDatabase
ENV MONGO_USERNAME=user
ENV MONGO_PWD=pwd
ENV PRIVATE_KEY=key
ENV SendGrid_key=sendgrid
ENV PORT=4000
ENV NODE_ENV='production'

EXPOSE 4000

CMD ["npm" ,"run","docker-build-webapp"]