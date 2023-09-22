FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/customers .

COPY /libs ./libs

EXPOSE 3004

CMD [ "npm", "run" , "start:dev"]