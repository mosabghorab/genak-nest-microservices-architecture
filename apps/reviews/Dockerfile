FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/reviews .

COPY /libs ./libs

EXPOSE 3013

CMD [ "npm", "run" , "start:dev"]