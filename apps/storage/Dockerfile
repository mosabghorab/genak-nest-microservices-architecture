FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

COPY /service-account-key.json .

RUN npm install

COPY /apps/storage .

COPY /libs ./libs

CMD [ "npm", "run" , "start:dev"]