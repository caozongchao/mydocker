FROM node:14.17.6
#ENV ANYPROXY_VERSION=4.1.3

WORKDIR /app

RUN npm install -g anyproxy \
  && npm install redis \
  && npm install fs

COPY . /app

# 修改时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 8101 8104 8102

#进入容器执行的命令
#anyproxy-ca
#cp /root/.anyproxy/certificates/rootCA.crt /usr/local/share/ca-certificates
#anyproxy -i --rule sample.js --file /app/anyproxy.log