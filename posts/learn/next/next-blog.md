---
title: 使用next打造自己的博客test修改
description: 文章描述
aside: false
date: 2023-02-20
tags:
  - next
  - react
---

# 使用next打造自己的博客

本文将介绍，如何使用next来打造自己的私人博客。
- [预览地址](http://next-blog.woai996.com/)

## 创建next项目

使用`create-next-app`来创建项目

```sh
pnpm create next-app
```

得到一个大概这样的目录结构

![](https://s2.loli.net/2023/02/21/2zAN1WHFLb7j5is.png)


把首页的内容清一清，开始完成我们的博客系统


## 创建markdown文件夹

我们做开发，非常喜欢使用`markdown`来编写技术文档，在根目录下创建文件夹`docs`。然后随便加入几篇markdown文章。

我这边也准备好了

![](https://s2.loli.net/2023/02/25/QZ6cHjGBhqwfVx9.png)


## 读取静态的markdown文件

这一步主要使用 nodejs 的文件模块来读取`src/docs`下的markdown文件，然后转换成html渲染到页面中


| 库名 | 功能  |
| :--:  | :--:  |
| `globby` | 递归读取文件系统中的md文件  |
| `markdown-it` | 将markdown内容转换为html  |
| `prismjs` | 代码高亮  |
| `dayjs` | 日期函数  |
| `front-matter` | 读取文件头的配置  |


```
pnpm i globby front-matter prismjs front-matter dayjs -D
```

1. 创建文件`src/tool/index.ts` 来处理文章内容



```ts
import { globby } from "globby";
import { promises as fsp } from "fs";
import fm from "front-matter";
import p from "path";
import MarkdownIt from "markdown-it";
import Prism from "prismjs";

// 加载需要的语言
const loadLanguages = require("prismjs/components/");
loadLanguages(["go", "typescript", "ts", "go-module", "go-mod"]);

import dayjs from "dayjs";

// 初始化 MarkdownIt 实例
const md = new MarkdownIt({
  html: true,
  // 代码高亮
  highlight: (code, lang) => { 
    // 获取语法解析器
    const grammar = Prism.languages[lang] || Prism.languages.markup;
    // 使用 Prism 对代码进行高亮
    return Prism.highlight(code, grammar, lang);
  },
});

/**
 * 获取绝对路径
 * @param {string} dir - 相对路径
 * @returns {string} 绝对路径
 */
function absPath(dir: string) {
  return p.isAbsolute(dir) ? dir : p.resolve(process.cwd(), dir);
}

/**
 * 获取所有文章路径
 * @returns {Promise<string[]>} 所有文章的相对路径
 */
export const readPostListPath = async () => {
  const files2 = await globby(["docs/**/*.md"], {});
  return files2.map((s) => s.replace(".md", ""));
};

/**
 * 读取指定路径的 Markdown 文章内容，并解析 Front Matter 和正文，返回解析结果
 * @param {string} path - Markdown 文章的相对路径
 * @returns {Promise<postItem>} Markdown 文章的解析结果
 */
export const readMdContent = async (path: string) => {
  const _path = p.join(absPath(""), path + ".md");
  const data = await fsp.readFile(
    // 处理一些读取文件出现的 bug
    _path.replace(`\\docs\\docs`, "\\docs").replace(`/docs/docs/`, "/docs/"),
    "utf8"
  );
  const matter = fm(data) as any;
  const html = md.render(matter.body);
  // 将日期格式化为时间戳
  matter.attributes.date = dayjs(matter.attributes.date).valueOf();
  // 将 Front Matter 和正文解析结果整合成一个对象返回
  return {
    html,
    ...matter.attributes,
    path,
  } as postItem;
};

/**
 * 读取所有 Markdown 文章的内容，并解析 Front Matter 和正文，返回解析结果数组
 * @returns {Promise<postItem[]>} Markdown 文章的解析结果数组
 */
export const readAllMdContent = async () =>
  Promise.all((await readPostListPath()).map((path) => readMdContent(path)));

```



## 读取文章列表

在`src\pages\index.tsx`我们读取所有的文章内容


```tsx
// 导入必要的实用函数和组件
import { readAllMdContent, readPostListPath } from '@/utils';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { ReactElement } from 'react';

// 定义 getStaticProps 函数，用于为 Next.js 页面生成静态 props
export const getStaticProps: GetStaticProps = async (ctx) => {
  // 读取所有 Markdown 文件的内容
  const list = await readAllMdContent();

  return {
    props: {
      list: list
    }
  };
};

// 定义 ListProps 类型，表示列表页面的 props
type ListProps = {
  list: postItem[]
};

// 定义 List 组件，表示列表页面
const List: NextPage<ListProps> = ({ list }): ReactElement => {
  // 遍历文章列表，对于每篇文章，渲染一个链接到该文章的列表项
  return <div>{
    list.map(({ title, path }) => <div key={path}>
      <Link href={path}>{title}</Link>
    </div>)

  }</div>;
};

// 导出 List 组件
export default List;
```

`getStaticProps` 会在客户端页面渲染前调用，通过nodejs的能力，来获取到所有文章，生成一个列表

![](https://s2.loli.net/2023/02/25/CHc72XgaLSrF38P.png)

## 文章详情页面配置


创建文章组件，创建文件`src/pages/docs/[...path].tsx`，填写内容

`[...path].tsx`属于next中的动态路由，可以匹配`docs/`开头的所有路径


同时动态路由需要 导出`getStaticPaths`来告诉next需要生成多少页面。
```tsx
// 导入必要的实用函数和组件
import { readMdContent, readPostListPath } from '@/utils';
import { GetStaticProps, NextPage } from 'next';
import { ReactElement, useMemo } from 'react';

// 定义 getStaticProps 函数，用于为 Next.js 页面生成静态 props
export const getStaticProps: GetStaticProps = async (ctx) => {
  // 从上下文对象中提取路径参数
  const { path } = ctx.params as any;

  // 读取位于指定路径下的 Markdown 文件的内容
  const data = await readMdContent(`/docs/${path.join('/')}`);

  return {
    props: {
      data
    }
  };
};

// 定义 getStaticPaths 函数，用于为动态路由生成静态路径
export const getStaticPaths = async () => {
  // 读取所有文章的路径列表，并将每个路径包装在 params 对象中
  const paths = (await readPostListPath()).map(path => ({ params: { path: [path] } }));

  return {
    paths,
    fallback: true
  };
};

// 定义 PostPageProps 类型，表示文章页面的 props
type PostPageProps = {
  data: postItem
};

// 定义 PostPage 组件，表示文章页面
const PostPage: NextPage<PostPageProps> = ({ data = {} as postItem }): ReactElement => {
  return <div>
    <div className='container-box vp-doc'>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{
        __html: data.html
      }}></div>
    </div>
  </div>;
};

// 导出 PostPage 组件
export default PostPage;
```
这样我们已经渲染了文章内容

博客的主要功能都已经完成了
![](https://s2.loli.net/2023/02/25/Z8SzkWNdpJ5RfG4.png)



**参考文档**
- [使用 React 和 Next.js 构建博客](https://zhuanlan.zhihu.com/p/461577858)
