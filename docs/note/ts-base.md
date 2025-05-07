---
title: TypeScript 基础
group:
  title: 'Type Script'
---

## TypeScript vs JavaScript

TypeScript 是 “强类型” 版的 JavaScript，当我们在代码中定义变量 (包括普通变量、函数、组件、hook 等) 的时候，TypeScript 允许我们在定义的同时指定其类型，这样使用者在使用不当的时候就会被及时报错提醒：

```ts
interface SearchPanelProps {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SearchPanelProps['param']) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {};
```

比起原来的 JavaScript，TypeScript 带来了完全不一样的开发体验，bug 大大减少了，编辑器提示快了，代码更易读了， 开发速度快了（看似多写代码，其实由于前面几点节省了大量开发时间）。

## TypeScript 的类型

ts 中常用的 8 种类型： number, string, boolean, 函数，array, any, void, object

- number

  数字类型，包含小数、其他进制的数字：

  ```ts
  let decimal: number = 6;
  let hex: number = 0xf00d;
  let binary: number = 0b1010;
  let octal: number = 0o744;
  let big: bigint = 100n;
  ```

- string

  字符串

  ```ts
  let color: string = 'blue';
  ```

- array

  在 TS 中，array 一般指所有元素类型相同的值的集合，比如：

  ```ts
  let list: Array<number> = [1, 2, 3];

  // or

  interface User {
    name: string;
  }
  const john = { name: 'john' };
  const jack = { name: 'jack' };
  let personList = [john, jack]; // 这里 john 和 jack 都是 User 类型的
  ```

  和这种混合类型的 “数组”：

  ```ts
  let l = ['jack', 10];
  ```

  在 TS 中不是 数组 /array，它们叫作 tuple，下面会提到。

- boolean

  布尔值：

  ```ts
  let isDone: boolean = false;
  ```

- 函数

  两种方法：
  在我们熟悉的 “JS 函数” 上直接声明参数和返回值：

  ```ts
  const isFalsy = (value: any): boolean => {
    return value === 0 ? false : !value;
  };
  ```

  直接声明你想要的函数类型：

  ```ts
  export const useMount = (fn: () => void) => {
    useEffect(() => {
      fn();
    }, []);
  };

  const isFalsy: (value: any) => boolean = (value) => {
    return value === 0 ? true : !!value;
  };
  ```

- any

  any 表示这个值可以是任何值，被定义为 any 就意味着不做任何类型检查：

  ```ts
  let looselyTyped: any = 4;
  // looselyTyped 的值明明是个4，哪里来的ifItExists方法呢？
  // 由于声明为any，我们没法在静态检查阶段发现这个错误
  looselyTyped.ifItExists();
  ```

  为了让 TS 不再报错而使用很多 any，这样做会失 去 TS 的保护。应该尽量避免使用 any

- void

  绝大部分情况下，只会用在这一个地方：表示函数不返回任何值或者返回 undefined (因为函数不返回任何值的时候 === 返回 undefined)

  ```ts
  /**
   * 上节课写的 useMount
   */
  export const useMount = (fn: () => void) => {
    useEffect(() => {
      fn();
    }, []);
  };
  ```

- object

  除了 number, string, boolean, bigint, symbol, null, or undefined，其他都是 object。

下面是其他 TS 类型。

- tuple

  一个典型的 tuple：

  ```ts
  const [users, setUsers] = useState([]);
  ```

  tuple 是 “数量固定，类型可以各异” 版的数组。

  在 React 中有可能使用 tuple 的地方就是 custom hook 的返回值，注意 isHappy → tomIsHappy 以及其他名字的变化，这里使用 tuple 的好处就显现出来了：便于使用者重命名：

  ```ts
  const useHappy = () => {
    //....
    return [isHappy, makeHappy, makeUnHappy];
  };

  const SomeComponent = () => {
    const [tomIsHappy, makeTomHappy, makeTomUnHappy] = useHappy(false);
    // ...
  };
  ```

- enum
  ```ts
  enum Color {
    Red,
    Green,
    Blue,
  }
  let c: Color = Color.Green;
  ```
- null 和 undefined

  null 和 undefined 在 TypeScript 中既是一个值，也是一个类型：

  ```ts
  let u: undefined = undefined;
  let n: null = null;
  ```

- unknown

  unknown 表示这个值可以是任何值。

  ❓❓❓❓❓❓

  这句话怎么这么熟悉，刚才是不是用来形容 any 的？

  > unknown 的用法：在你想用 any 的时候，用 unknown 来代替，简 单来说，unknown 是一个 "严格" 版的 any。

  ```ts
  const isFalsy = (value: unknown) => {
    // 大家不用考虑这段console有啥意义，把它打在你的代码里对应的  位 置，观察编辑器会不会报错；
    // 再思考它应不应该报错
    console.log(value.mayNotExist);
    return value === 0 ? true : !!value;
  };
  ```

- never

  ```ts
  // 这个 func返回的就是never类型，用到比较少，在类型操作等场景会 用到
  const func = () => {
    throw new Error();
  };
  ```

- interface

  interface 不是一种类型，应该被翻译成接口，或者说使用上面介绍的 类型，创建一个我们自己的类型：

  ```ts
  interface User {
    id: number;
  }
  const u: User = { id: 1 };
  ```

啥时候需要声明类型

理论上来说在我们声明任何变量的时候都需要声明类型（包括普通变量、函数、组件、hook 等等），声明 函数、组件、hook 等需要声明参数 和 返回值的类型。

但是在很多情况下，TS 可以帮我们自动推断，我们就不用声明了，比如：

```ts
// 这里虽然没有显式声明，但是ts自动推断这是个number
let a = 1;

// 自动推断返回值为number
function add(a: number, b: number) {
  return a + b;
}

// 自动推断返回值为boolean
const isFalsy = (value: unknown) => {
  return value === 0 ? true : !!value;
};
```

.d.ts

JS 文件 + .d.ts 文件 === ts 文件。

.d.ts 文件可以让 JS 文件继续维持自己 JS 文件的身份，而拥有 TS 的类型保护。

一般我们写业务代码不会用到，但是点击类型跳转一般会跳转到 .d.ts 文件。
