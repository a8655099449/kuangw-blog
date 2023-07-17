---
title: nginx 的转发配置
description: 文章描述
aside: false
date: 2023-07-17
tags:
  - tool
---




## 定向转发，比如讲 `/a` 转发到 `baidu.com/a`


```conf
location /a {
    proxy_pass http://baidu.com/a;
}
```

## 需要抹除掉前缀 比如匹配 `/a` 开头的 转发到 `baidu.com` , `/a` 不带过去

```
location /a {
  rewrite ^/a/(.*)$ /$1 break;
  proxy_pass https://baidu.com;
}
```
