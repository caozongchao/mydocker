FROM docker.elastic.co/logstash/logstash-oss:6.5.3

RUN logstash-plugin install logstash-input-jdbc
RUN logstash-plugin install logstash-output-elasticsearch

ADD mysql-connector-java-5.1.47-bin.jar /usr/share/logstash/mysql-connector-java-5.1.47-bin.jar