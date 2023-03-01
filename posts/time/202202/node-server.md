---
title: 使用Koajs构建后端程序所遇到的一些问题
description: 文章描述
aside: false
date: 2023-02-26
tags:
  - nodejs
---

上次使用node开发后端还是三年前的事情，然后就一直写前端，最近又重新有了想用node开发后端的想法。本文将记录使用node开发的经验。

## 使用ts创建koa项目


基础的 koa 项目必然包含 `koa` 和 `koa-router`

1. 新建一个文件夹`koa-server` 
2. 新建文件 `package.json`，输入以下的内容

```json
{
  "name": "koa-server",
  "version": "1.0.0",
  "description": "",
  "main": "src/app.js",
  "scripts": {
    "dev": "nodemon src/app.ts",
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


## 参数获取


### 获取body参数
`koajs` 处理 body参数，手动通常比较麻烦，我们可以使用 `koa-bodyparser` 这个库

下面时使用方法


```ts
/* ....省略 */
import bodyParser from "koa-bodyparser";
/* ....省略 */
app.use(bodyParser({}));

router.post("/", async (ctx) => {
  // ctx.body = await AppDataSource.manager.find(User);
  const body = ctx.request.body
});

```
## 定义通用的返回函数


通用的返回函数会更加的规范。我们定义一个成功的返回和错误的返回


```ts
/**
 * 成功响应方法
 *
 * @param {BaseContext} ctx - 上下文对象
 * @param {object} options - 成功响应配置对象
 * @param {string} [options.message="ok"] - 成功信息
 * @param {*} [options.data=null] - 响应数据
 */
export const successResponse = (
  ctx: BaseContext,
  { message = "ok", data = null as any} = {}
) => {
  ctx.status = 200;

  ctx.body = {
    code: 200,
    data,
    message,
  };
};

/**
 * 失败响应方法
 *
 * @param {BaseContext} ctx - 上下文对象
 * @param {object} options - 失败响应配置对象
 * @param {string} [options.message="server error"] - 失败信息
 * @param {*} [options.data=null] - 响应数据
 * @param {number} [options.code=500] - 响应状态码
 */
export const failResponse = (
  ctx: BaseContext,
  { message = "server error", data = null as any ,code = 500}
) => {
  ctx.status = code;

  ctx.body = {
    code: code,
    data,
    message,
  };
};

```


## 处理文件上传


`koaBody`这个中间件，处理文件上传


下面是一个实例，多余的代码就不写了，结合上下文哈

```ts
import koaBody from "koa-body";
import Router from "koa-router";
import path from "path";

const fileRouter = new Router();

// 设置文件上传路由及处理函数
fileRouter.post(
  "/upload",
  koaBody({
    multipart: true, // 允许上传文件
    formidable: {
      maxFileSize: 10 * 1024 * 1024, // 限制上传文件大小
      uploadDir: path.join(__dirname, "../../public/uploads"), // 文件上传目录
      keepExtensions: true, // 保持文件后缀
      onFileBegin(name, file) { // 重命名上传文件
        file.newFilename = file.filepath.split("\\").pop();
      },
    },
  }),
  async (ctx) => {
    const file: any = ctx.request.files.file; // 获取上传的文件对象

    if (!file) { // 如果没有文件则返回上传失败提示
      ctx.body = "上传失败，请选择上传文件";
      return;
    }

    // 返回上传成功结果
    ctx.body = {
      code: "ok",
      path: file.newFilename, // 上传文件的新文件名
      file: file, // 上传文件对象
    };
  }
);

export default fileRouter;
```