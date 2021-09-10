FROM node:14.17.6
#ENV ANYPROXY_VERSION=4.1.3

WORKDIR /app

RUN npm install -g anyproxy \
  && npm install redis \
  && npm install fs

# 修改时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 8101 8104 8102

COPY . /app

RUN cd ~ \
  && mkdir .anyproxy \
  && cd .anyproxy \
  && cp -r /app/cert ~/.anyproxy/ \
  && cp ~/.anyproxy/cert/rootCA.crt /usr/local/share/ca-certificates/ \
  && update-ca-certificates

#anyproxy-ca
#cp /root/.anyproxy/certificates/rootCA.crt /usr/local/share/ca-certificates
#update-ca-certificates
#anyproxy -i --rule sample.js --file /app/anyproxy.log