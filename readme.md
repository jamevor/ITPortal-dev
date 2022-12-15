# WPI Hub-

## Table of Contents

* [CI/CD](#cicd)
* [Environment Setup](#environment-setup)

## CI/CD

There are 3 environments in the CI/CD configuration, each with their own branch and gitlab runner tag:

Justin

1. [Development Environment (development)](#development-environment)
2. [Staging Environment (staging)](#staging-environment)
3. [Production Environment (production)](#production-environment)

As such the workflow should be:
1. Do development on `dev` branch.
2. Test deployment by merging into `staging` branch.
3. Deploy to production environment by merging into `master` branch.

### Development Environment

[![pipeline status](https://gitdev.wpi.edu/cjchagnon/ITPortal/badges/dev/pipeline.svg)](https://gitdev.wpi.edu/cjchagnon/ITPortal/commits/dev)

This environment is setup on `sirloin.wpi.edu` as a shell gitlab runner running Apache2 as a reverse proxy to force https and forward requests to `localhost:8080`.

**All changes on the `dev` branch will be reflected in this environment**

### Staging Environment

[![pipeline status](https://gitdev.wpi.edu/cjchagnon/ITPortal/badges/staging/pipeline.svg)](https://gitdev.wpi.edu/cjchagnon/ITPortal/commits/staging)

This environment is setup on itsdev.wpi.edu

* RHEL 8 - OS
* npm - package management
* nodejs - to run the server
* nginx - reverse proxy upstream to pm2 processes
* pm2 - 4 nodes for load balancing
* external connection to database

**All changes on the `staging` branch will be reflected in this environment**

### Production Environment

[![pipeline status](https://gitdev.wpi.edu/cjchagnon/ITPortal/badges/master/pipeline.svg)](https://gitdev.wpi.edu/cjchagnon/ITPortal/commits/master)

This environment is not setup yet but it will be exactly like staging

**All changes on the `master` branch will be reflected in this environment**

## Environment Setup

A quick compilation of all the necessary how-to's required to get this project up and running for CI/CD through gitlab runners.

### Install Node.js

1. `$ sudo dnf module list nodejs` - see available modules and status
2. `$ sudo dnf install nodejs` - install default version
    * making sure the version installed matches the LTS version on nodejs.org. To install alternate version, syntax is `name:stream/profile`
3. `$ node -v` - verify installation

### Install npm

1. `$ sudo dnf install npm` - install default version of npm
2. `$ npm --version` - verify installation

### Install pm2

1. `$ npm install pm2@latest -g` - use npm to install pm2 globally
2. `$ pm2 --version` - verify installation

### Install nginx

1. `$ sudo dnf install nginx` - install default version of nginx
2. `$ nginx -v` - verify installation
3. `$ sudo systemctl start nginx` - start the web server
4. `$ sudo systemctl enable nginx` - enable as service so it starts on system restart
5. `$ sudo firewall-cmd --zone=public --permanent --add-service=http` - enable port 80 through firewall
6. `$ sudo firewall-cmd --reload` - reload
7. Try visiting http://{{hostname}} there should be an nginx splash page
8. Edit `/etc/nginx/nginx.conf` to configure web server
9. `$ sudo nginx -s reload` to reload nginx config
10. `$ sudo firewall-cmd --zone=public --permanent --add-service=https` - enable port 443 through firewall
11. `$ sudo firewall-cmd --reload` - reload
12. Edit `/etc/nginx/nginx.conf` to configure SSL on web server

#### Sample nginx config files

`/etc/nginx/nginx.conf`

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

# load_module modules/ngx_http_brotli_filter_module.so;
# load_module modules/ngx_http_brotli_static_module.so;

events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip on;
        gzip_disable "msie6"; # IE


        gzip_vary on; # cache
        gzip_min_length 1024;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_buffers 16 8k;
        gzip_http_version 1.1;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Brotli Settings
        ##

        # brotli on;
        # brotli_comp_level 6;
        # brotli_types text/xml image/svg+xml application/x-font-ttf image/vnd.microsoft.icon application/x-font-opentype application/json font/eot application/vnd.ms-fontobject application/javascript font/otf application/xml application/xhtml+xml text/javascript  application/x-javascript text/plain application/x-font-truetype application/xml+rss image/x-icon font/opentype text/css image/x-win-bitmap;

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        # include /etc/nginx/sites-enabled/*;
}
```



`/etc/nginx/conf.d/itportal.conf`


```nginx
upstream portals {
        #enable sticky session based on ip
        ip_hash;

        server localhost:8080;
        server localhost:8081;
        server localhost:8082;
        server localhost:8083;
}

server {
        listen  80;
        listen [::]:80;
        server_name {{ server name }};
        return 301 https://$host$request_uri;
}

server {
        listen [::]:443 ssl http2 ipv6only=on;
        listen 443 ssl http2;
        ssl_certificate {{ /path/to/cert/fullchain.pem }}
        ssl_certificate_key {{ /path/to/cert/privkey.pem }}
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        proxy_hide_header X-Powered-By; # remove server/os data from headers
        proxy_pass_header Server;

        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains;";
        add_header X-Frame-Options sameorigin always;
        add_header X-Content-Type-Options nosniff;
        add_header Content-Security-Policy "script-src 'self' 'unsafe-inline' www.google-analytics.com www.googletagmanager.com fonts.googleapis.com fonts.gstatic.com via.placeholder.com img-src 'self' www.google-analytics.com www.googletagmanager.com via.placeholder.com data:;";

        add_header Referrer-Policy same-origin;
        add_header Feature-Policy "geolocation 'self';";
        add_header Service-Worker-Allowed "/";


        resolver 8.8.8.8;

        location / {
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-Proto https;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header X-Forwarded-Host $remote_addr;
                client_max_body_size 15M;
                proxy_pass "http://portals/";
        }
}

```

#### Install brotli (optional)

1. `sudo yum -y install https://extras.getpagespeed.com/release-el7-latest.rpm` - add repository
2. `sudo yum -y install nginx-module-nbr` - install modules
3. Uncomment/add the following lines in `/etc/nginx/nginx.conf`

```nginx
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;

##
# Brotli Settings
##

brotli on;
brotli_comp_level 6;
brotli_types text/xml image/svg+xml application/x-font-ttf image/vnd.microsoft.icon application/x-font-opentype application/json font/eot application/vnd.ms-fontobject application/javascript font/otf application/xml application/xhtml+xml text/javascript  application/x-javascript text/plain application/x-font-truetype application/xml+rss image/x-icon font/opentype text/css image/x-win-bitmap;
```

4. `$ sudo nginx -s reload` to reload the web server

### Install Gitlab Runner

1. `$ curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash` - add Gitlab repositories
2. `$ sudo yum install gitlab-runner` - install gitlab-runner
3. `$ sudo gitlab-runner register` - begin registration of the runner
4. Enter gitlab instance URL

```
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
https://gitdev.wpi.edu


Note: need to migrate to gitlab02 for current release of gitlab.
```

5. Obtain the runner token from `Settings > CI/CD > Runner settings` in Gitlab interface
6. Enter the token

```
Please enter the gitlab-ci token for this runner
{{ xxx }}
```

7. Enter a description for the runner

```
Please enter the gitlab-ci description for this runner
{{ [hostname] my-runner }}
```

8. Enter the tags for the runner - tags are good

```
Please enter the gitlab-ci tags for this runner (comma separated):
{{ my-tag,another-tag }}
```

9. Enter the runner executor

```
Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
shell
```
