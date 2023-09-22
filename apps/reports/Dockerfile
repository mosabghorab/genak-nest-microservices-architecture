FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/reports .

COPY /libs ./libs

EXPOSE 3015

CMD [ "npm", "run" , "start:dev"]