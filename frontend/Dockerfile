FROM node:18 as build

ENV NODE_ENV=production


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN chmod +x ./node_modules/@esbuild/linux-x64/bin/esbuild

COPY . .

RUN chmod +x ./node_modules/.bin/vite
RUN npm run build


FROM node:18-alpine

WORKDIR /app
COPY --from=build /app .


ENV HOST=0.0.0.0
EXPOSE 4173
CMD ["npm","run", "preview","--", "--host", "0.0.0.0"]