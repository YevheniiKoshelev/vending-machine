FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT ["npm", "start"]

# docker build -t soda-node .
# docker run -i soda-node