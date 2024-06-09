FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
WORKDIR /app/dist

EXPOSE 3001
CMD ["npm", "start"]