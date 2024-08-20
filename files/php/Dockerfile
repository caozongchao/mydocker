FROM nanoninja/php-fpm:7.4.10
MAINTAINER caozongchao "caozongchao@163.com"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 安装php扩展
RUN apt-get update \
    && apt-get install -y \
        git \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libxslt1-dev \
        build-essential \
    && docker-php-ext-configure mysqli --with-mysqli=mysqlnd  \
    && docker-php-ext-install mysqli  \
    && docker-php-ext-install pcntl \
    && docker-php-ext-install xsl\
    && rm -r /var/lib/apt/lists/*

#通过pecl命令安装redis扩展
#RUN pecl install redis && docker-php-ext-enable redis

#安装swoole
# RUN git clone https://github.com/swoole/swoole-src.git \
#     && ( \
#         cd swoole-src \
#         && phpize \
#         && ./configure --enable-swoole-debug --enable-mysqlnd \
#         && make -j$(nproc) && make install \
#         ) \
#     && docker-php-ext-enable swoole

# COPY swoole_loader72.so /usr/local/lib/php/extensions/no-debug-non-zts-20170718

COPY docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

#安装composer
ENV COMPOSER_HOME /root/composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ENV PATH $COMPOSER_HOME/vendor/bin:$PATH

WORKDIR /data

# Write Permission
RUN usermod -u 1000 www-data

# 安装ffmpeg
RUN apt-get update \
  && apt-get install software-properties-common -y \
  && apt-get install ffmpeg -y \
  && apt-get install mediainfo -y

# ADD pkg/fonts /opt/libreoffice7.1/share/fonts/truetype
# ADD pkg/LibreOffice_7.1.4_Linux_x86-64_deb /data/pkg

# RUN mkdir -p /usr/share/man/man1/

# RUN apt-get remove -y libreoffice* && apt-get -y autoremove && apt-get update \
#   && apt-get install -y lrzsz libxinerama1 libdbus-glib-1-2 libpangocairo-1.0-0 libcups2 libsm6 libx11-xcb1 default-jre libreoffice-java-common \
#   && cd /data/pkg/LibreOffice_7.1.4.2_Linux_x86-64_deb/DEBS/ \
#   && dpkg -i ./*.deb
# #   && rm -rf /var/lib/apt/lists/* /data/pkg

RUN apt-get update && apt-get install -y sudo
ADD sudoers /etc/sudoers
RUN chmod 440 /etc/sudoers && rm -rf /usr/bin/libreoffice && ln -sv  /usr/local/bin/libreoffice7.1 /usr/bin/libreoffice
