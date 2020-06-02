FROM node:10.15.3 as build-deps-adminui
WORKDIR /usr/src/app
# ensuring both package.json AND package-lock.json are copied
COPY build/src/package.json ./
COPY build/src/yarn.lock ./
# install dependencies
RUN yarn install --production
# copy the contents of the app
COPY build/src .
# Get this DNP version and git hash. Results in /usr/src/app/.version.json
RUN apt-get update && apt-get --yes install git jq
ADD .git .git
ADD dappnode_package.json .
RUN ./getVersionData.sh
ENV REACT_APP_API_URL http://my.dappmanager.dnp.dappnode.eth:3000/
RUN yarn run build

FROM node:10.15.3 as build-deps-openvpn
WORKDIR /usr/src/app
# ensuring both package.json AND package-lock.json are copied
COPY build/src_openvpn/package*.json ./
COPY build/src_openvpn/*lock* ./
# install dependencies
RUN yarn install --production
# copy the contents of the app
COPY build/src_openvpn .
# build for production
RUN yarn run build
RUN node injectToHtml

FROM nginx:1.17-alpine
RUN mkdir -p /usr/www/adminui && mkdir -p /usr/www/openvpn && mkdir -p /usr/www/openvpn/cred
COPY --from=build-deps-adminui /usr/src/app/build /usr/www/adminui
COPY --from=build-deps-openvpn /usr/src/app/build /usr/www/openvpn
COPY build/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 8090
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
