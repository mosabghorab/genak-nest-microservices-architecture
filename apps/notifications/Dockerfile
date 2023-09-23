FROM node:lts

WORKDIR /app

COPY /package.json .
COPY /tsconfig.json .
COPY /.npmrc .
COPY /service-account-key.json .

RUN npm install --only=production
RUN npm install @nestjs/cli

COPY /apps/notifications .
COPY /libs ./libs

EXPOSE 3009

RUN npm run build

CMD ["node", "dist/src/main"]