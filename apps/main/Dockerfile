FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/main .

COPY /libs ./libs

EXPOSE 3017

CMD [ "npm", "run" , "start:dev"]