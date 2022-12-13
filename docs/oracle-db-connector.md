# oracle-db-connector installation

## Sirloin

Download binaries for client
```shell
$ wget https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basiclite-linux.x64-19.6.0.0.0dbru.zip
```

Unzip binaries
```shell
$ unzip instantclient-basiclite-linux.x64-19.6.0.0.0dbru.zip
```

Move to `/opt/oracle` directory
```shell
# mv instantclient_19_6 /opt/oracle
```

Search for `libaio` package
```shell
# apt search libaio
```

Install `libaio`
```shell
# apt-get install libaio1
```

add to ld library path
```
# sh -c "echo /opt/oracle > /etc/ld.so.conf.d/oracle-instantclient.conf"
# ldconfig
```
