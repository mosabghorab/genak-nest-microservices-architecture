FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

COPY /service-account-key.json .

RUN npm install

COPY /apps/notifications .

COPY /libs ./libs

EXPOSE 3009

CMD [ "npm", "run" , "start:dev"]