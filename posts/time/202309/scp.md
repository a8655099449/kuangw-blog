---
title: 使用nginx解决csp问题
description: 使用nginx解决csp问题
aside: false
date: 2023-11-15
tags:
  - 其他
---


问题出现的原因，是因为运维同事因为某种原因，更改了安全策略，导致前端中加载都报了csp问题。可以通过增加nginx配置来解决


## 前端资源增加

```conf

server {
    # 其他 server 配置...
    location / {
        add_header Content-Security-Policy "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data:;";
        # 其他配置...
    }
}

```
以上的配置可以避免前端资源加载中遇到的任何 csp 问题

## 服务端配置

add_header Content-Security-Policy "default-src *; connect-src *;";

```conf

server {
    # 其他 server 配置...
    location / {
        add_header Content-Security-Policy "default-src *; connect-src *;";
        # 其他配置...
    }
}

```