FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/locations .

COPY /libs ./libs

EXPOSE 3003

CMD [ "npm", "run" , "start:dev"]