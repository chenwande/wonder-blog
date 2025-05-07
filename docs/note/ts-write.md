---
title: TS手写题
group:
  title: 'Type Script'
---

## 基础

```ts
// 条件判断
type isNumber<T> = T extends number ? true : false;
type isNumberRes = isNumber<1>;

// 递归循环
type createArray<Len, Item, Arr extends Item[] = []> = Arr['length'] extends Len
  ? Arr
  : createArray<Len, Item, [...Arr, Item]>;
type createArrayRes = createArray<10, number>;

// ts操作字符串
type left = 'aaa';
type right = 'bbb';
type str = `${left},${right}`;
type stringRes = str extends `aaa,${infer rest}` ? rest : never;

// 创建对象了类型
type obj = {
  a: 1,
  b: '2'
}

type newObj = {
  [key in keyof obj]: obj[key]
}
```

## 两数之和

```ts
// ts 的高级类型想做数字的运算只能用构造不同长度的数组再取 length 的方式，因为没有类型的加减乘除运算符
type createArr<Len, Item, Arr extends Item[] = []> = Arr['length'] extends Len
  ? Arr
  : createArr<Len, Item, [...Arr, Item]>;

type Add<A extends number, B extends number> = [...createArr<A, any>, ...createArr<B, any>]['length']

type testAdd = Add<2, 5> 
```

## 循环字符串

```ts
type repeatStr<
  S extends string,
  N extends number,
  StrArr extends S[] = [],
  Res extends string = ''
> = StrArr['length'] extends N
  ? Res
  : repeatStr<S, N, [...StrArr, S], `${Res}${S}`>;

type testRepeatStr = repeatStr<'Name', 5>;
```

## 解析函数名

```ts
type alphaChars = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
    | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
    | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';


type parseFnName<
  SourceStr extends string,
  Res extends string = ''
> = SourceStr extends `${infer Char}${infer Rest}`
  ? Char extends alphaChars
    ? parseFnName<Rest, `${Res}${Char}`>
    : `Res: ${Res}, Rest: ${SourceStr}`
  : never;

  type testParseFnName = parseFnName<'add(1, 2)'>
```

## 过滤对象

```ts
type filterNumberValue<Params> = {
  [key in keyof Params]: Params[key] extends number ? Params[key]  : never;
}[keyof Params]

type testFilterNumberValue = filterNumberValue<{
  a: 1,
  b: '2',
  c: 3
}>
```
