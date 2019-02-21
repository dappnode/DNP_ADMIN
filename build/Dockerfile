FROM node as build-deps-adminui
WORKDIR /usr/src/app
# ensuring both package.json AND yarn.lock are copied
COPY src/package.json ./
COPY src/yarn.lock ./
# install dependencies
RUN yarn install --production
# copy the contents of the app
COPY src .
# build for production
RUN yarn run build

FROM nginx:1.12-alpine
RUN mkdir -p /usr/www/adminui
COPY --from=build-deps-adminui /usr/src/app/build /usr/www/adminui
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
