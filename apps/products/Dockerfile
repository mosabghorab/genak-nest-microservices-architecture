FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/products .

COPY /libs ./libs

EXPOSE 3002

CMD [ "npm", "run" , "start:dev"]