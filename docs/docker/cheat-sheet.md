# Cheat Sheet

Build image
```shell
docker build --tag <username>/<app_name> .
```

Create and run container from image
```shell
docker run --name <app_name> -p <container_port>:<host_port> -d <username>/<app_name>
```

Start container
```shell
docker start <app_name>
```

Restart container
```shell
docker restart <app_name>
```

Stop container
```shell
docker stop <app_name>
```

Delete container
```shell
docker rm <app_name>
```
