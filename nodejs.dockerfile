FROM node:20

RUN npm install -g nodemon
WORKDIR /home/node/app
COPY app/package.json ./

RUN npm install
COPY ./app/ ./ 

# Install dependencies
RUN npm ci

EXPOSE 443
CMD ["nodemon", "server.js"]
