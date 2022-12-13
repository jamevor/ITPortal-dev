# Nodejs v12 upgrade notes

[J] = John

[R] = Ryan

## Instructions

1. [J] does a yum module update on nodejs:
    ```
    988  dnf module disable nodejs:10
    989  dnf module enable nodejs:12
    990  dnf module install nodejs
    ```
2. [R] as gitlab-runner, cd into project directory and run `npm rebuild`
3. [J] as root, run `npm i -g pm2 && pm2 update`
4. [R] as gitlab-runner, run `pm2 delete all`
5. [R] as gitlab-runner, run `pm2 start ecosystem.config.js --env {{ env }}`