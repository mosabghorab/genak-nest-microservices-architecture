FROM node:lts

WORKDIR /app

COPY /package.json .
COPY /tsconfig.json .
COPY /.npmrc .

RUN npm install --only=production
RUN npm install @nestjs/cli

COPY /apps/complains .
COPY /libs ./libs

EXPOSE 3014

RUN npm run build

CMD ["node", "dist/src/main"]