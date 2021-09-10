FROM node:14.17.6
ENV ANYPROXY_VERSION=4.1.3

WORKDIR /app

RUN npm install -g anyproxy@$ANYPROXY_VERSION \
  && npm install cheerio \
  && npm install redis \
  && npm install request-promise \
  && npm install fs \
  && npm install request

COPY . /app

# 修改时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 8101 8104 8102

ENV NODE_PATH /usr/local/lib/node_modules

#进入容器执行的命令
#anyproxy-ca
#anyproxy -i --rule sample.js --file /app/anyproxy.log
