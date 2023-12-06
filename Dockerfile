FROM node:18.16.0-alpine3.17

# Create app directory
WORKDIR /app

RUN apk --no-cache add curl

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app

# General Install of Deps
# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . /app

EXPOSE 3599

HEALTHCHECK CMD curl --fail http://localhost:3599/ping || exit 1

CMD [ "node", "index.js" ]