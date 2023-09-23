FROM node:lts

WORKDIR /app

COPY /package.json .
COPY /tsconfig.json .
COPY /.npmrc .

RUN npm install --only=production
RUN npm install @nestjs/cli

COPY /apps/auth .
COPY /libs ./libs

EXPOSE 3011

RUN npm run build

CMD ["node", "dist/src/main"]