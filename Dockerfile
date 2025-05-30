FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install -g pm2

COPY . .

RUN npm run build

EXPOSE 3030

CMD ["pm2-runtime", "scripts/ecosystem.config.js"]