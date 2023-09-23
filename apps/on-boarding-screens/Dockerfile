FROM node:lts

WORKDIR /app

COPY /package.json .
COPY /tsconfig.json .
COPY /.npmrc .

RUN npm install --only=production
RUN npm install @nestjs/cli

COPY /apps/on-boarding-screens .
COPY /libs ./libs

EXPOSE 3001

RUN npm run build

CMD ["node", "dist/src/main"]