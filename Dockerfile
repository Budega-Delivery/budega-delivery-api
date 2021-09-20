FROM node:10-alpine
WORKDIR /usr/src/api

MAINTAINER yurisbv@gmail.com

COPY . .
RUN npm i

EXPOSE 3000
CMD ['npm', 'run', 'start:prod']
