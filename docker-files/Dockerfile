FROM node:16
ARG GPR_TOKEN
RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json  ./
COPY ./src ./src

RUN npm i --no-optional --ignore-scripts

EXPOSE 3311
EXPOSE 3310