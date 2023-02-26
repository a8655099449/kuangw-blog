---
title: 记一次使用node开发服务器的经验
description: 文章描述
aside: false
date: 2023-02-26
tags:
  - nodejs
---

上次使用node开发后端还是三年前的事情，然后就一直写前端，最近又重新有了想用node开发后端的想法。本文将记录使用node开发的经验。


## 关于技术的选型

本次将会全部采用`ts`进行开发。我们将使用`koa`作为服务端的框架。使用[`sqlite`](https://github.com/TryGhost/node-sqlite3)来存储数据

## 使用ts创建koa项目

1. 新建一个文件夹`koa-server` 
2. 新建文件 `package.json`，输入以下的内容

```json
{
  "name": "car-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon --delay 200ms --exec \"npm run clear && ts-node src/app.ts\"",
    "clear": "echo \"server is restart\""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/koa": "^2.13.5",
    "koa": "^2.14.1",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.5"
  },
  "devDependencies": {
    "@types/koa-router": "^7.4.4",
    "koa-router": "^12.0.0",
    "nodemon": "^2.0.20",
    "sqlite3": "5.0.0"
  }
}
```
3. 执行 `pnpm i`
4. 新建文件`src/routers/index.ts`
```ts
import Router from "koa-router";
const router = new Router();
// 处理全局请求
router.use(async (ctx, next) => {
  console.log('收到请求', ctx.url);
  await next();
  console.log('请求处理完成');

});

router.get("/", async (ctx, next) => {
  const query = ctx.query;
  ctx.body = 'hello word';

});
router.get("/user", async (ctx, next) => {
  const query = ctx.query;

  ctx.body = query;
  ctx.type = "application/json";

  await next();
});
export default router;
```
4. 新建文件`src/app.ts`

```ts
import Koa from "koa";
import router from "./routes";
const app = new Koa();
app.use(router.routes());
app.listen(3000, () => {
  console.log("server is running http://localhost:3000/");
});

```

5. 执行 `pnpm run dev`

## 我遇到的一些问题



### 安装sqlite3时，半天安装不好。
最终我在[这个回答里面](https://github.com/TryGhost/node-sqlite3/issues/1424)找到了解决方案，就是安装`5.0.0`版本

将指令改为

```sh
pnpm i -D sqlite3@5.0.0
```

