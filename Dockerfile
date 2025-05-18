FROM node:20

WORKDIR /app

COPY package*.json ./

#install all package from package.json
RUN npm install
#copy all files that have in root folder
COPY . .