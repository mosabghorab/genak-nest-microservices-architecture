FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/settings .

COPY /libs ./libs

EXPOSE 3016

CMD [ "npm", "run" , "start:dev"]