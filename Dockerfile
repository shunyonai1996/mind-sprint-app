FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g vite
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]