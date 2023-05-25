FROM node:16

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm i --no-optional --ignore-scripts

EXPOSE 3311
EXPOSE 3310

CMD ["npm", "run", "start:debug"]