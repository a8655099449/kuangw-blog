---
title: 近期遇到的问题01
description: 文章描述
aside: false
date: 2023-05-23
tags:
  - javascript
---

## 在vscode的ts自动引入中，怎么默认使用相对路径？

这个问题是一个ts文件的引入问题，ts在某些项目中，会以绝对路径来自动导入依赖，这样造成了开发的一些不便。可以通过配置来解决这个问题。
```json
{
  "typescript.preferences.importModuleSpecifier": "relative"
}
```


## 最新的mobx如何在react中使用

mobx是个非常好用的react状态管理库，在[taro](https://docs.taro.zone/docs/)中都可以进行使用.现在使用起来也变得十分简便了。在函数时组件中也能轻松使用。

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);border-radius:2px;" width="800" height="450" src="https://codesandbox.io/p/sandbox/nervous-yalow-em4g4z?embed=1" allowfullscreen></iframe>