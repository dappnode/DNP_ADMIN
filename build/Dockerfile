FROM node as build-deps
WORKDIR /opt/app
# ensuring both package.json AND package-lock.json are copied
COPY src/package*.json ./
# install dependencies
RUN yarn install
# copy the contents of the app
COPY src .
# build for production
RUN yarn run build

FROM nginx:1.12-alpine
COPY --from=build-deps /opt/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
