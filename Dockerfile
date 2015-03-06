FROM node:0.10-slim

RUN apt-get update

RUN apt-get install -y git libfreetype6 libfontconfig

RUN npm -g install grunt-cli bower

RUN echo "{\"analytics\": true, \"allowRoot\": true}" > /root/.bowerrc

EXPOSE 8000
