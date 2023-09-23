FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/orders .

COPY /libs ./libs

EXPOSE 3012

CMD [ "npm", "run" , "start:dev"]