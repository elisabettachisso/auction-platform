FROM node:latest AS build
WORKDIR /var/www
COPY package*.json /var/www
RUN npm install
COPY . /var/www
RUN npm install -g nodemon
EXPOSE 3000
CMD ["npx", "nodemon", "--watch", ".", "-e", "js", "app.js"]
