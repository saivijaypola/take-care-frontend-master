FROM node:12

COPY  . /opt/app

WORKDIR /opt/app/

RUN npm i -g pm2

RUN npm i

RUN npm rebuild node-sass

ENV GENERATE_SOURCEMAP=false

RUN npm run build

ARG value

ENV envValue=$value

ARG exposeportvalue

ENV envexposeport=$exposeportvalue

EXPOSE $envexposeport

CMD ["sh", "-c", "pm2-runtime start ecosystem.config.js --node-args=--require dotenv/config --env ${envValue}"]