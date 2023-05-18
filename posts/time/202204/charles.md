---
title: 使用charles进行抓包
description: 文章描述
aside: false
date: 2023-05-17
tags:
  - javascript
---


charles 是一款十分强大的抓包软件，本文将介绍，如何在iphone上和mac上使用 charles 进行抓包.



## 下载 charles 

[下载地址](https://www.charlesproxy.com/download/) 

mac上直接进行安装，没有额外步骤


## 在mac上的配置

### 设置Recording setting

![](https://s2.loli.net/2023/05/18/HpF7vgoXKEiAz5m.png)



在include里添加80 和 443 端口设置

![](https://s2.loli.net/2023/05/18/iH8ctuRDU1vrsBO.png)


![](https://s2.loli.net/2023/05/18/WTiYU3xjwGkv9DL.png)


### 设置ssl端口配置

同样的 添加443 和 80端口的配置
![](https://s2.loli.net/2023/05/18/zqwVQBacMCSTxsl.png)


## 安装证书

在这里点击安装

![](https://s2.loli.net/2023/05/18/ogBuE3QLklA8MyN.png)


然后在mac的证书中点击信任

![](https://s2.loli.net/2023/05/18/z41EJP7qLWDn2Tk.png)

**打开这个开关后，就可以抓取mac上的发包请求了**


![](https://s2.loli.net/2023/05/18/QbtNcqFpYL42RA9.png)


## iPhone 手机上抓包

1. 先确认手机和mac连入了同一个网段
   
2. 查看mac上的内网ip地址
![](https://s2.loli.net/2023/05/18/F1vjBrXolJuTGMs.png)

3. 在手机上配置配置wifi代理
![](https://s2.loli.net/2023/05/18/S5H2oTIavQUjLhG.png)
4. 安装手机证书,点击这个选项
![](https://s2.loli.net/2023/05/18/JOmgRqeoFWdvnIM.png)

5. 手机访问 `chls.pro/ssl`
  
在这个页面会弹出一个证书，让你安装，点击安装

然后在手机上选择 【设置】=> 【通用】=> 【VPN与设备管理】 => 选择安装charles的证书

【设置】=> 【通用】=> 【关于本机】 => 【证书信任设置】 => 打开关于charles的选项

ok到此为止，iphone手机上的抓包也没有问题了

![](https://s2.loli.net/2023/05/18/aklAEh685JsZdfc.png)