---
title: Utility Type
group:
  title: 'Type Script'
---

## 类型别名和联合类型

- 联合类型

  ```ts
  const myFavoriteNumber: string | number;

  myFavoriteNumber = 'seven';
  myFavoriteNumber = 7;

  // TS2322: Type '{}' is not assignable to type 'string | number'.
  myFavoriteNumber = {};

  const jackFavoriteNumber: string | number;
  ```

- 类型别名

  ```ts
  // 类型别名在很多情况下可以和interface互换
  // interface Person {
  //   name: string
  // }
  type Person = { name: string };
  const xiaoMing: Person = { name: 'xiaoming' };

  // 类型别名, interface 在这种情况下没法替代type
  type FavoriteNumber = string | number;
  let roseFavoriteNumber: FavoriteNumber = '6';

  // interface 也没法实现Utility type
  type Person = {
    name: string;
    age: number;
  };
  ```

## `Partial<Type>`

作用：将 Type 内所有属性置为可选，返回一个给定类型 Type 的子集

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

- 泛型`<T>`
- keyof 运算符：获取`T`的所有键
- `[P in keyof T]`：遍历`T`的所有 key，映射类型、索引签名
- `?`：可选

## `Required<Type>`

作用：`Required`与上面的`Partial`相反，构建返回一个 Type 的所有属性为必选的新类型。

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

- 映射类型它支持通过+或者-来添加 or 移除 readonly 或者?修饰符。

## `Readonly<Type>`

作用：将 Type 所有属性置为只读。

```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

- readonly 的含义跟 JS 的 const 不能修改的含义一样，指的是不能重写(重写赋值)。

## `Pick<Type, Keys>`

Keys 的类型有要求：string literal or union of string literals。

作用：构建返回一个根据 Keys 从类型 Type 拣选所需的属性的新类型。

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## `Exclude<Type, ExcludedUnion>`

作用：从 Type 中排除可以分配给 ExcludedUnion 的类型。

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```

## `Parameters<Type>`

作用：基于类型 Type 的参数构建一个新的元组类型

```ts
// 使用

import http form './util/http'

// 获取函数的请求参数
Parameters<typeof http>
```

```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

- `T extends (...args: any) => any`：定义了 Parameters 的泛型约束，兼容目前所有函数的类型定义。
- `infer P`：用于表示待推断的函数参数。

- `T extends (...args: infer P) => any ? P : never`：表示如果 T 能赋值给 `(...args: infer P) => any`，则结果是 `(...args: infer P) => any` 类型中的参数为 `P`，否则返回为 `never`。

## `ReturnType<Type>`

作用：基于函数 Type 的返回值类型创建一个新类型。

```ts
// 使用

import http form './util/http'

// 获取函数的请求参数
ReturnType<typeof http>
```

```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```
