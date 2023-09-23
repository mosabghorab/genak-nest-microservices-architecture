FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/vendors .

COPY /libs ./libs

EXPOSE 3005

CMD [ "npm", "run" , "start:dev"]