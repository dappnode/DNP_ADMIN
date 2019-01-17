FROM node as build-deps-adminui
WORKDIR /usr/src/app
# ensuring both package.json AND package-lock.json are copied
COPY src/package*.json ./
COPY src/*lock* ./
# install dependencies
RUN yarn install --production
# copy the contents of the app
COPY src .
# build for production
RUN npm run build

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

FROM nginx:1.12-alpine
RUN mkdir -p /usr/www/adminui && mkdir -p /usr/www/openvpn && mkdir -p /usr/www/openvpn/cred
COPY --from=build-deps-adminui /usr/src/app/build /usr/www/adminui
COPY --from=build-deps-openvpn /usr/src/app/build /usr/www/openvpn
COPY nginx.conf /etc/nginx/nginx.conf

#### FOR TESTING DEMO PURPOSES
COPY test-cred-encrypted /usr/www/openvpn/cred/9eX3660PxxcwzpqP
# Use: http://<IP>:8080/#9eX3660PxxcwzpqP&CTNtXGIw1ODN2nJAfd8BRQTnQ7zumCQlQ08CEkivf/8=
#### END

EXPOSE 80
EXPOSE 8080
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
