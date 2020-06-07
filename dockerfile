FROM node:10

WORKDIR /usr/src/app

COPY . .

RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn
RUN yarn build

CMD [ "yarn", "server" ]