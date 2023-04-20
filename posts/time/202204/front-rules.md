---
title: 前端规范的一些示例配置文件
description: 文章描述
aside: false
date: 2023-04-20
tags:
  - 代码规范
---


## EditorConfig 配置

```conf
root = true

[*]
indent_style = tab //缩进风格，可选配置有 `tab` 和 `space` 
indent_size = 2      //缩进大小，可设定为 `1-8` 的数字，比如设定为 `2` ，那就是缩进 `2` 个空格。
end_of_line = lf     //换行符，可选配置有 `lf` ，`cr` ，`crlf`
charset = utf-8      //编码格式，通常都是选 `utf-8` 
trim_trailing_whitespace = false  //去除多余的空格
insert_final_newline = false      //在尾部插入一行
```
## Prettier 配置

新建文件`prettierrc`


```json
{
  "arrowParens": "always",               // 总是给箭头函数的参数加上括号
  "bracketSameLine": false,              // 对象或数组的起始括号不放在同一行
  "bracketSpacing": true,                // 对象字面量中大括号内是否保留空格
  "embeddedLanguageFormatting": "auto",  // 自动格式化内嵌代码的格式
  "htmlWhitespaceSensitivity": "css",    // 对 HTML 文件的空格敏感度设置
  "insertPragma": false,                 // 是否在文件开头插入一个特殊的注释标记，用于表明文件已经被 Prettier 格式化过
  "jsxSingleQuote": false,               // jsx 是否使用单引号
  "printWidth": 80,                      // 单行代码最长字符长度，超过之后会自动格式化换行
  "proseWrap": "preserve",               // 是否在 markdown 文件中保留段落结构
  "quoteProps": "as-needed",             // 对象属性是否需要加引号
  "requirePragma": false,                // 是否在文件头部添加 Prettier 的标记，来指明这个文件需要使用 Prettier 格式化
  "semi": true,                          // 语句末尾是否加分号
  "singleAttributePerLine": false,       // jsx 中是否每个属性占一行
  "singleQuote": true,                   // 是否使用单引号
  "tabWidth": 2,                         // 缩进的空格数
  "trailingComma": "none",               // 对象或数组的最后一个元素后面是否加逗号
  "useTabs": true,                       // 是否使用制表符代替空格
  "vueIndentScriptAndStyle": false,      // 对 Vue 文件中的 <script> 和 <style> 部分进行缩进
  "endOfLine": "lf"                      // 换行符的风格，与 `.editorconfig` 保持一致设置。
}
```

- [参考链接](https://juejin.cn/post/7207617774633107512)