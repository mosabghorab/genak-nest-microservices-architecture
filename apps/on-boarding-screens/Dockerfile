FROM node:20

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

COPY /.npmrc .

RUN npm install

COPY /apps/on-boarding-screens .

COPY /libs ./libs

EXPOSE 3001

CMD [ "npm", "run" , "start:dev"]