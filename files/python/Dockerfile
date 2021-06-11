FROM python:3.6

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY ./scrapyd.conf /etc/scrapyd/

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt
