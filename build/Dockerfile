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

FROM node as build-deps-openvpn
WORKDIR /usr/src/app
# ensuring both package.json AND package-lock.json are copied
COPY src_openvpn/package*.json ./
COPY src_openvpn/*lock* ./
# install dependencies
RUN yarn install --production
# copy the contents of the app
COPY src_openvpn .
# build for production
RUN yarn run build
RUN node injectToHtml

FROM nginx:1.12-alpine
RUN mkdir -p /usr/www/adminui && mkdir -p /usr/www/openvpn && mkdir -p /usr/www/openvpn/cred
COPY --from=build-deps-adminui /usr/src/app/build /usr/www/adminui
COPY --from=build-deps-openvpn /usr/src/app/build /usr/www/openvpn
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 8090
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
