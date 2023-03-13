---
title: react 项目中加入eslint
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - react
---

# react 项目中加入eslint

## 1. 使用vite创建一个react项目

```
yarn crate vite
```

## 2. 在package.json中增加以下的内容

```json{22-33}
{
  "name": "eslint",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint:fix": "eslint ./src --ext .jsx,.js,.ts,.tsx --quiet --fix --ignore-path ./.gitignore",
    "lint:format": "prettier  --loglevel warn --write \"./**/*.{js,jsx,ts,tsx,css,md,json}\" ",
    "lint": "yarn lint:format && yarn lint:fix ",
    "type-check": "tsc"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "pre-commit": "^1.2.2",
    "prettier": "^2.5.1",
    "@typescript-eslint/eslint-plugin": "^5.10.2",
    "@typescript-eslint/parser": "^5.10.2",
    "eslint": "^8.8.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-import": "^2.25.4",
    "eslint-plugin-jsx-a11y": "^6.5.1",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.28.0",
    "eslint-plugin-simple-import-sort": "^7.0.0",
    "eslint-plugin-react": "^7.32.2",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  },
  "pre-commit": "lint",
  "license": "MIT"
}
```

## 3. 增加以下几个配置文件

`.eslintrc.cjs`
:::details
```js
module.exports = {
  root: true, // 该配置文件为项目的根配置文件
  parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
  parserOptions: {
    ecmaVersion: 2020, // 使用 ECMAScript 2020 标准
    sourceType: 'module', // 使用 ECMAScript 模块
    ecmaFeatures: {
      jsx: true, // 支持 JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
    'import/resolver': {
      node: {
        paths: ['src'], // 设置 import 模块解析的根路径为 src 目录
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // 指定解析模块时的文件扩展名
      },
    },
  },
  env: {
    browser: true, // 代码运行在浏览器中
    amd: true, // 代码使用 AMD 模块
    node: true, // 代码使用 Node.js 模块
  },
  extends: [
    'eslint:recommended', // ESLint 推荐规则
    'plugin:@typescript-eslint/recommended', // 使用 @typescript-eslint 推荐规则
    'plugin:react/recommended', // 使用 React 推荐规则
    'plugin:jsx-a11y/recommended', // 使用 jsx-a11y 推荐规则
    'plugin:prettier/recommended', // 使用 Prettier 推荐规则，需要放在最后
  ],
  plugins: ['simple-import-sort', 'prettier', 'react'], // 使用 simple-import-sort 和 prettier 、react 插件
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }], // 指定 prettier 规则
    'react/react-in-jsx-scope': 'off', // 关闭无需 import React 的规则
    'jsx-a11y/accessible-emoji': 'off', // 关闭 emoji 的可访问性检查
    'react/prop-types': 'off', // 关闭 propTypes 检查
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数返回值类型声明的检查
    'simple-import-sort/imports': 'error', // 强制使用简单导入排序规则
    'simple-import-sort/exports': 'error', // 强制使用简单导出排序规则
    'jsx-a11y/anchor-is-valid': [
      // 指定 a 标签的 href 属性要么为空字符串，要么是有效的 URL
      'error',
      {
        components: ['Link'], // a 标签的替代组件
        specialLink: ['hrefLeft', 'hrefRight'], // 特殊链接属性名
        aspects: ['invalidHref', 'preferButton'], // 违规情况和优先使用 button 的情况
      },
    ],
    'react/self-closing-comp': [ // 指定jsx标签中，但标签内没有内容时，自动转换为单标签
      'error',
      {
        component: true,
        html: true,
      },
    ],
  },
};
```
:::


`.eslintignore`

:::details
```
node_modules
.DS_Store
dist
dist-ssr
*.local
node_modules/*
```
:::


`.prettierrc.cjs`

:::details
```js
module.exports = {
// 是否在语句末尾添加分号
semi: true,
// 是否在对象或数组的最后一个元素后面添加逗号
trailingComma: 'all',
// 是否使用单引号
singleQuote: true,
// 每行代码的最大宽度
printWidth: 90,
// 一个制表符的宽度
tabWidth: 2,
// 行尾符号，auto 表示自动匹配
endOfLine: 'auto',
};
```
:::


`.prettierignore`

:::details
```
node_modules
.DS_Store
dist
dist-ssr
*.local
node_modules/*
```
:::

然后就可以了

如果需要vscode保存时自动修复，需要在设置中增加

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

具体可以查看[这个仓库](https://github.com/a8655099449/react-vite-eslint)