FROM node:lts

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/admins .

COPY /libs ./libs

EXPOSE 3008

CMD [ "npm", "run" , "start:dev"]

