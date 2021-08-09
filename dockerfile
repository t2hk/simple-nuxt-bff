FROM node:14.17.4-alpine

ARG PORT=3000
ARG ENVIRONMENT=develop
ENV EV=${ENVIRONMENT}

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

WORKDIR /app

COPY ./package*.json ./
RUN apk update && \
    npm install

COPY ./jsconfig.json ./
COPY ./api ./api
COPY ./client ./client
COPY ./nuxt.config.js ./
COPY ./LICENSE ./
COPY ./config ./tmp_config

RUN mkdir ./config && \
    if [ "${EV}" == "dev" ]; \
    then mv ./tmp_config/env.development.js ./config/; \
    elif [ "${EV}" == "prd" ]; \
    then mv ./tmp_config/env.production.js ./config/; \
    else mv ./tmp_config/env.staging.js ./config/; \
    fi && \
    rm -rf ./tmp_config && \
    npm run build:${EV}

EXPOSE ${PORT}
ENTRYPOINT npm run start:${EV}
