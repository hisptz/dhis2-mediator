# getting node 16 omage
FROM node:gallium-bookworm-slim

# Create app directory
WORKDIR /mediator


# Install app dependencies
COPY package*.json ./
# Bundle app source
COPY . ./

RUN npm install --omit=dev


# exposing port
EXPOSE 3000

CMD [ "node", "main" ]
