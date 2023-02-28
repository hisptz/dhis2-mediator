# getting node 16 omage
FROM node:16

# Create app directory
WORKDIR /usr/src/dhis2-mediator-api


# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .


# exposing port
EXPOSE 3000

CMD [ "npm", "start" ]