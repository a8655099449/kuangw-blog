---
title: 如何使用脚手架的形式快速搭建项目
description: 本文将描述使用脚手架快速搭建项目的方法
aside: false
date: 2023-03-19
tags:
  - javascript
  - nodejs
---

在我们使用一些脚手架的时候，官方都会提供一个命令方便我们迅速创建一个可以直接启动的模板。比如`vitejs` ,比如说以下这些命令。

`yarn create vite`

`yarn create next-app`

输入后我们就会得到以下这样一个问答式的界面。

![](https://s2.loli.net/2023/03/19/uECQLVGjF1ieW8Z.png)

但官方给出的模板通常是极简单的。有时候我们需要具有有更多功能的模板。那么可以使用自己的指令来进行创建。

本文将讲解，如何使用指令来创建模板，但具体模板需要具备那些功能，则根据个人喜欢，不在本文涉及范围之内。

## 创建项目

按照约定，如果要使用指令来创建项目，需要`create-`为前缀,我们的项目就以`demo-app`为名字，大家自己也可以自定义名，这部分不做约束。

```
mkdir create-demo-app
cd ./create-demo-app
npm init -y
```
初始化之后得到这样一个项目结构

![](https://s2.loli.net/2023/03/19/gj2Nl5QrOopaZWi.png)

## 创建脚本

1. 新建文件`index.js`

```javascript
#!/usr/bin/env node
// 以上的注释意义是执行环境为node，只能写在第一行，不会报错
console.log('create-demo-app',)
```

2. 修改`package.json`中的内容

加入`bin`字段中的执行指令

```json{12-14}
{
  "name": "create-demo-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bin": {
    "create-demo-app": "index.js"
  }
}
```

:::tip
在 Node.js 中，`package.json` 文件中的 `bin` 字段用于指定可以从命令行访问的可执行文件的路径。这些可执行文件可以是 JavaScript 文件，也可以是任何其他可执行文件（如二进制文件）。
:::
3. 执行 `yarn link` 指令 , 会提示以下的内容

![](https://s2.loli.net/2023/03/19/VnewpJNIg2odKFG.png)

:::tip
执行`yarn link` 时，node会在全局创建一个可执行的命令，类似于全局脚本。
:::

这样我们在任意位置，执行`yarn create demo-app` 都可以执行我们的`index.js`文件
![](https://s2.loli.net/2023/03/19/XydeQjKNhfcrq2V.png)

## 配置对话内容

对话内容我们需要使用到两个库 `prompts ` ,` kolorist`

`prompts` 用于创建对话 <br/>
`kolorist` 用于创建出一些带颜色的字体，可以美化我们的脚本，颜值即正义

```
yarn add prompts kolorist
```
修改 `index.js` 来创建一些问题

```js
#!/usr/bin/env node

const prompts = require("prompts");
const kolorist = require("kolorist");
const { cyan, green, red } = kolorist;

const init = async () => {
  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: green("请输入项目名称:"),
    initial: "myApp", // 默认值
  });

  const { type } = await prompts({
    type: "select", // 选项模式
    message: cyan("请选择技术栈"),
    choices: [
      { title: "vue", value: "template-vue" },
      { title: "react", value: "template-react" },
      { title: "react-ts", value: "template-react-ts" },
    ],
    name: "type",
    initial: 0,
  });

  console.log({ projectName, type });
};

init().catch((e) => {
  console.error(e);
});
```

再次执行`yarn create demo-app` 会得到以下的结果

![](https://s2.loli.net/2023/03/19/A4N51EwRxdHcjge.png)


## 生成模板

生产模板需要我们在根目录中先准备好模板，然后根据用户的选择，复制这些内容即可。

我创建三个模板，里面只填入简单的内容方便我们区分

![](https://s2.loli.net/2023/03/19/akGKZduxSt6zfUl.png)

> 注意我的文件夹的名字，和上面选项`value`的值保持一致，方便稍后我们创建文件

在`index.js`中加入一个拷贝文件的功能,顺便再验证`projectName`可能存在重复问题。完整代码如下:


```js
#!/usr/bin/env node

const prompts = require("prompts");
const kolorist = require("kolorist");
const { blue, cyan, green, lightGreen, lightRed, magenta, red, reset, yellow } =
  kolorist;
const cwd = process.cwd();
const fs = require("node:fs");

const path = require("path");
const getName = async () => {
  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: reset("请输入项目名称:"),
    initial: "myApp",
  });
  if (!projectName) {
    throw console.log(red("项目名称不能为空"));
  }
  const root = path.join(cwd, projectName);
  // 如果文件夹存在 重新输入文件名
  if (fs.existsSync(root)) {
    console.log(red("该文件夹已存在，请重新输入"));
    return getName();
  }

  return projectName
};

const init = async () => {
  const projectName = await getName();
  const root = path.join(cwd, projectName);
  const { type } = await prompts({
    type: "select",
    message: cyan("请选择技术栈"),
    choices: [
      { title: "vue", value: "template-vue" },
      { title: "react", value: "template-react" },
      { title: "react-ts", value: "template-react-ts" },
    ],
    name: "type",
    initial: 0,
  });

  if (!type) {
    console.log(red("创建失败，请重新创建"));
    return;
  }

  copy(path.resolve(__dirname, `./${type}`), root);
  console.log(green("项目创建成功，接下来请选择以下命令:"));
  console.log(green(`cd ./${projectName}`));
  console.log(green(`pnpm install or npm install or yarn install 安装依赖`));
};

init().catch((e) => {
  console.error(e);
});
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}
```