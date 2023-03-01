---
title: typeorm
description: 文章描述
aside: false
date: 2023-03-01
tags:
  - nodejs
---


typeorm 是一个成熟的 nodejs `orm` 库 。 本文将介绍它的基本使用。




## 如何定义一个数据实体

> `数据实体` 可以理解为数据库中的一张表


```ts
import { Entity, Column, PrimaryGeneratedColumn, EntityTarget } from "typeorm";


@Entity()
export class User  {

  @PrimaryGeneratedColumn()
  id: number;
  /** @desc 用户名 */
  @Column({
    unique: true,
  })
  name: string;

  /** @desc 用户账号 */
  @Column({
    unique: true,
  })
  account: string;

  /** @desc 用户密码 */
  @Column({
    default: "-",
  })
  password: string;
  /** @desc 用户头像 */
  @Column({
    default:
      "https://picx.zhimg.com/50/v2-7f52c46dbe2c4352454f9cca4c1ddda4_l.jpg?source=b6762063",
  })
  avatar: string;

  @Column({
    default: "",
  })
  token: string;
  // 给客户端的数据
  toApi() {
    const { name, id, avatar } = this;
    return {
      name,
      id,
      avatar
    };
  }
}
```



## 如何连接数据库

提供了连接多种数据库的方法，这里我们连接`sqlite`作为示范。

```ts
/**

@fileOverview TypeORM 数据库连接配置
*/
import { DataSource, createConnection } from "typeorm";
import { User } from "../entities/User";

import path from "path";

// 创建数据库连接配置
const AppDataSource = new DataSource({
type: "sqlite",
database: path.join(__dirname, "base.db"), // 数据库文件存放路径
synchronize: true, // 自动同步数据库结构，只在开发环境中使用
logging: true, // 开启日志
entities: [User], // 实体类列表
});

export default AppDataSource; // 导出数据库连接配置对象

```


## 验证数据格式

`typeorm`本身不通过数据验证的功能，我们可以使用[`class-validator`](https://github.com/typestack/class-validator)


class-validator 提供了相当多基础的验证器满足我们业务中的大部分需求

![](https://s2.loli.net/2023/03/01/GfXCE8iNa5n7QdI.png)

**使用方法**

```ts{2,13}
import { Entity, Column, PrimaryGeneratedColumn, EntityTarget } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class User  {

  @PrimaryGeneratedColumn()
  id: number;
  /** @desc 用户名 */
  @Column({
    unique: true,
  })
  @Length(1, 20)
  name: string;

}
```


## 自定义验证器

`class-validator`提供了自定义验证器的功能,下面这是一个自定义是否存在相同姓名的验证器，每次验证时我们回去数据库校验。

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from "class-validator";
import AppDataSource from "../../db";

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [entityClass, propertyName] = args.constraints;
    const repository = AppDataSource.getRepository(entityClass);

    const entity = await repository.findOne({
      where: {
        [propertyName]: value,
      },
    });

    return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists`;
  }

}


export function IsUnique(entityClass: Function, propertyName: string, name:string) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${name} 已存在`,
      },
      constraints: [entityClass, propertyName],
      validator: IsUniqueConstraint,
    });
  };
}
```

**使用**


```ts{3,13}
import { Entity, Column, PrimaryGeneratedColumn, EntityTarget } from "typeorm";
import { Length } from "class-validator";
import { IsUnique } from "../utils/vaildator/UniqueName";
@Entity()
export class User  {
  @PrimaryGeneratedColumn()
  id: number;
  /** @desc 用户名 */
  @Column({
    unique: true,
  })
  @Length(1, 20)
  @IsUnique(User, "name", "用户名")
  name: string;
}
```

## 安装sqlite3时，半天安装不好。


最终我在[这个回答里面](https://github.com/TryGhost/node-sqlite3/issues/1424)找到了解决方案，就是安装`5.0.0`版本

将指令改为

```sh
pnpm i -D sqlite3@5.0.0
```

<img src="http://localhost:6669/uploads/4680f6a46413e4316fe10a900" />

![](http://localhost:6669/uploads/4680f6a46413e4316fe10a900)