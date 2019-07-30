FROM node:11-alpine
WORKDIR /workspace
COPY package.json yarn.lock /workspace/
RUN yarn install
COPY . .
RUN yarn server:build
RUN yarn build
EXPOSE 8080
CMD ["yarn", "start"]
