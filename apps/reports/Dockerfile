FROM node:lts

WORKDIR /app

COPY /package.json .
COPY /tsconfig.json .
COPY /.npmrc .

RUN npm install --only=production
RUN npm install @nestjs/cli

COPY /apps/reports .
COPY /libs ./libs

EXPOSE 3015

RUN npm run build

CMD ["npm", "run", "start:prod"]