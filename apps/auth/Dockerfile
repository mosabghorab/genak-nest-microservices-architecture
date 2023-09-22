FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/auth .

COPY /libs ./libs

EXPOSE 3011

CMD [ "npm", "run" , "start:dev"]