FROM nanoninja/php-fpm:7.2.15
MAINTAINER caozongchao "caozongchao@163.com"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 国内更改源
ARG CHANGE_SOURCE=false
RUN if [ ${CHANGE_SOURCE} = true ]; then \
    # Change application source from deb.debian.org to aliyun source
    sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    sed -i 's/security-cdn.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/buster.list && \
    sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/buster.list \
;fi


# 安装php扩展
RUN apt-get update \
    && apt-get install -y \
        vim \
        git \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libxslt1-dev \
        build-essential \
        software-properties-common \
        ffmpeg \
        mediainfo \
    && docker-php-ext-configure mysqli --with-mysqli=mysqlnd  \
    && docker-php-ext-install mysqli  \
    && docker-php-ext-install pcntl \
    && docker-php-ext-install xsl

#通过pecl命令安装redis扩展
#RUN pecl install redis && docker-php-ext-enable redis

#安装swoole
#RUN git clone https://github.com/swoole/swoole-src.git \
#    && ( \
#        cd swoole-src \
#        && phpize \
#        && ./configure --enable-swoole-debug --enable-mysqlnd \
#        && make -j$(nproc) && make install \
#        ) \
#    && docker-php-ext-enable swoole

# COPY swoole_loader72.so /usr/local/lib/php/extensions/no-debug-non-zts-20170718
COPY docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

#安装composer
ENV COMPOSER_HOME /root/composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ENV PATH $COMPOSER_HOME/vendor/bin:$PATH

# 安装 Node
#RUN apt-get update &&\
#   apt-get install -y --no-install-recommends gnupg &&\
#   curl -sL https://deb.nodesource.com/setup_10.x | bash - &&\
#   apt-get update &&\
#  apt-get install -y --no-install-recommends nodejs &&\
#   npm config set registry https://registry.npm.taobao.org --global &&\
#    npm install --global gulp-cli

WORKDIR /data

# Write Permission
RUN usermod -u 1000 www-data

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm /var/log/lastlog /var/log/faillog
