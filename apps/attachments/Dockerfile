FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/attachments .

COPY /libs ./libs

EXPOSE 3007

CMD [ "npm", "run" , "start:dev"]