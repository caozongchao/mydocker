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

RUN cd ~ \
  && mkdir .anyproxy \
  && cd .anyproxy \
  && mv /app/certificates ~/.anyproxy/ \
  && cp ~/.anyproxy/certificates/rootCA.crt /usr/local/share/ca-certificates/ \
  && update-ca-certificates

# 修改时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 8101 8104 8102

ENV NODE_PATH /usr/local/lib/node_modules

#CMD anyproxy -i --rule sample.js --file /app/log/anyproxy.log
