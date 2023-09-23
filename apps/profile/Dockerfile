FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/profile .

COPY /libs ./libs

EXPOSE 3010

CMD [ "npm", "run" , "start:dev"]