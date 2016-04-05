FROM        nginx

MAINTAINER  Thibaut Géry

RUN mkdir /etc/nginx/sites-enabled

RUN apt-get update -y && apt-get install -y python-pip
RUN pip install Jinja2

ADD config_nginx_resolver.py /root
ADD resolver.conf.j2 /root

ADD nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

ADD apicpa.vhost /etc/nginx/sites-available/apicpa.conf

RUN ln -s /etc/nginx/sites-available/apicpa.conf /etc/nginx/sites-enabled/apicpa.conf

CMD /bin/bash -c 'python /root/config_nginx_resolver.py :> /etc/nginx/conf.d/resolver.conf' \
      && /bin/bash -c 'nginx -c /etc/nginx/nginx.conf -g "daemon off;"'
