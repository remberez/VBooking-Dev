FROM node:18 as build

ENV NODE_ENV=production


WORKDIR /usr/src/app/frontend

COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN chmod +x ./node_modules/@esbuild/linux-x64/bin/esbuild

COPY . .

RUN chmod +x ./node_modules/.bin/vite
RUN npm run build


FROM node:18-alpine

WORKDIR /usr/src/app/frontend/
COPY --from=build /app .


ENV HOST=0.0.0.0
EXPOSE 4173
CMD ["npm", "run", "dev"]
# CMD ["npm","run", "preview","--", "--host", "0.0.0.0"]