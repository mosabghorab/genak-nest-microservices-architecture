
FROM node:20 as base

WORKDIR app

COPY /package.json .

COPY /tsconfig.json .

FROM base as dev

RUN npm install

COPY /apps/documents .

COPY /libs ./libs

EXPOSE 3000

CMD [ "npm", "run" , "start:dev"]

FROM base as prod

RUN npm install --only=production

RUN npm install @nestjs/cli

COPY /apps/documents .

COPY /libs ./libs

EXPOSE 3000

RUN npm run build

CMD ["npm","run","start:prod"]
