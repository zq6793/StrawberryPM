FROM registry.cn-beijing.aliyuncs.com/wa/dev:vue AS building

ARG MODE="build"

COPY . /ui
WORKDIR /ui

# RUN npm config set registry https://registry.npm.taobao.org ;
RUN npm config set strict-ssl false ;\
    npm install ;\
	npm run ${MODE}

FROM registry.cn-beijing.aliyuncs.com/wa/nginx:alpine

COPY --from=building /ui/nginx.conf /etc/nginx/nginx.conf
COPY --from=building /ui/dist/ /var/www/html/
