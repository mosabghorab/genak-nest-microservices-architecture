FROM node:lts

WORKDIR /app

COPY /package.json .
COPY /tsconfig.json .
COPY /.npmrc .
COPY /service-account-key.json .

RUN npm install --only=production
RUN npm install @nestjs/cli

COPY /apps/storage .
COPY /libs ./libs

RUN npm run build

CMD ["npm", "run", "start:prod"]