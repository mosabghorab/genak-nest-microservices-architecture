FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/complains .

COPY /libs ./libs

EXPOSE 3014

CMD [ "npm", "run" , "start:dev"]