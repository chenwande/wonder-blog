---
title: JS手写题
group:
  title: 基础知识
nav:
  title: note
---

## 函数柯里化

函数柯里化的是一个为多参函数实现递归降解的方式。其实现的核心是:要思考如何缓存每一次传入的参数和传入的参数和目标函数的入参做比较。

闭包实现

```js
// 闭包实现
const curry = (fn) => {
  let params = [];
  const next = (...args) => {
    params = [...params, ...args];
    if (params.length < fn.length) {
      return next;
    } else {
      return fn.apply(fn, params);
    }
  };
  return next;
};

// 使用
const sum = (a, b, c, d) => {
  return a + b + c + d;
};
const fn = curry(sum);
const res = fn(1)(2)(3)(4);
console.log(res);
```

## 关于数组

### 手写 map 方法

`map()`方法根据回调函数映射一个新数组

```js
Array.prototype.map = function (fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (!this.hasOwnProperty(i)) continue; // 处理稀疏数组的情况
    result.push(fn(this[i], i, this));
  }
  return result;
};

// 使用
const arr = [1, 2, 3, , 5];
const mapArr = arr.map((item) => item * 2);
console.log(mapArr);
```

### 手写 filter 方法

`filter()`方法返回一个数组，返回的每一项是在回调函数中执行结果 true

```js
Array.prototype.filter = function (fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (!this.hasOwnProperty(i)) continue; // 处理稀疏数组的情况
    fn(this[i], i, this) && result.push(this[i]);
  }
  return result;
};

// 使用
const arr = [1, 2, 3, , 5];
const filterArr = arr.filter((item) => item > 2);
console.log(filterArr);
```

### 手写 reduce 方法

`reduce()`方法循环迭代，回调函数的结果都会作为下一次的形参的第一个参数

```js
Array.prototype.reduce = function (fn, initValue) {
  let result = initValue ? initValue : this[0];
  for (let i = initValue ? 0 : 1; i < this.length; i++) {
    if (!this.hasOwnProperty(i)) continue; // 处理稀疏数组的情况
    result = fn(result, this[i], i, this);
  }
  return result;
};

// 使用
const arr = [1, 2, 3, , 5];
const reduceRes = arr.reduce((sum, item) => sum + item);
console.log(reduceRes);
```

### 手写 every 方法

`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值

```js
Array.prototype.every = function (fn) {
  for (let i = 0; i < this.length; i++) {
    if (!this.hasOwnProperty(i)) continue; // 处里稀疏数组
    if (!fn(this[i], i, this)) return false;
  }
  return true;
};

// 使用
const arr = [1, 2, 3, , 5];
const everyRes = arr.every((item) => item > 0);
console.log(everyRes);
```

### 手写 some 方法

`some()` 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个布尔值

```js
Array.prototype.some = function (fn) {
  for (let i = 0; i < this.length; i++) {
    if (!this.hasOwnProperty(i)) continue; // 处里稀疏数组
    if (fn(this[i], i, this)) return true;
  }
  return false;
};

// 使用
const arr = [1, 2, 3, , 5];
const someRes = arr.some((item) => item > 5);
console.log(someRes);
```

### 手写 find 方法

`find()` 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined

```js
Array.prototype.find = function (fn) {
  for (let i = 0; i < this.length; i++) {
    if (!this.hasOwnProperty(i)) continue; // 处里稀疏数组
    if (fn(this[i], i, this)) return this[i];
  }
  return undefined;
};

// 使用
const arr = [1, 2, 3, , 5];
const findRes = arr.find((item) => item > 2);
console.log(findRes);
```

### 数组扁平化

- ES6 语法`flat(num)`

- reduce+递归方法

  ```js
  function flattening(arr) {
    if (!Array.isArray(arr)) return;
    return arr.reduce(
      (a, b) => a.concat(Array.isArray(b) ? flattening(b) : b),
      [],
    );
  }

  const arr1 = [1, [2], [3, [4]], [5, [6, [7]]]];
  const arr2 = [];
  console.log(flattening(arr1));
  ```

- 栈实现

  ```js
  function flattening(arr) {
    if (!Array.isArray(arr)) return;
    const stack = [...arr];
    const res = [];
    while (stack.length) {
      const value = stack.shift();
      Array.isArray(value) ? stack.push(...value) : res.push(value);
    }
    return res;
  }

  const arr1 = [1, [2], [3, [4]], [5, [6, [7]]]];
  const arr2 = [];
  console.log(flattening(arr1));
  ```

## 图片懒加载

- `scroll`滚动事件监听

  getBoundClientRect 的实现方式，监听 scroll 事件（建议给监听事件添加节流），图片加载完会从 img 标签组成的 DOM 列表中删除，最后所有的图片加载完毕后需要解绑监听事件

  ```js
  const lazyLoad = function (imgs) {
    let count = 0;
    const deleteImgs = [];
    const handler = () => {
      imgs.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          img.src = dataset.src;
          count++;
          deleteImgs.push(index);
          if (count === imgs.length) {
            document.removeEventListener('scroll', lazyLoad);
          }
        }
      });
      imgs = imgs.filter((_, index) => !deleteImgs.includes(index));
    };
    return handler();
  };
  ```

- `IntersectionObserver `自动观察

  intersectionObserver 的实现方式，实例化一个 IntersectionObserver ，并使其观察所有 img 标签；当 img 标签进入可视区域时会执行实例化时的回调，同时给回调传入一个 entries 参数，每当一个元素进入可视区域，将真正的图片赋值给当前 img 标签，同时解除对其的观察

  ```js
  const lazyLoad = function (imgs) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          entry.target.src = dataset.src;
          observer.unobserve(entry.target);
        }
      });
    });
    imgs.forEach((img) => observer.observe(img));
  };
  ```

## 防抖和节流

### 节流

同一事件在规定时间内多次触发，只执行第一次触发的事件

```js
// 第一次执行
function throttle(fn, time) {
  let preTime = 0;
  function throttleFn(...args) {
    const nowTime = new Date();
    if (nowTime - preTime > time) {
      fn.apply(this, args);
      preTime = nowTime;
    }
  }
  return throttleFn;
}

// 延迟后执行
function throttle(fn, time) {
  let timer = null;
  function throttleFn(...args) {
    const context = this;
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
    }, time);
  }
  return throttleFn;
}

// sleep函数
const sleep = async (delay) => {
  return new Promise((resole) => {
    setTimeout(resole, delay);
  });
};

// 测试
const f = throttle((count) => console.log(count), 2000);
(async function () {
  f(1); // 执行
  await sleep(1000);
  f(2); // 1000 < 2000 不执行
  await sleep(2000);
  f(3); // 1000 + 2000 > 2000 执行
  await sleep(1500);
  f(4); // 1500 < 2000 不执行
  await sleep(1000);
  f(5); // 1000 + 1500 > 2000 执行
})();
```

### 防抖

同一事件在规定时间内多次触发，后触发的事件覆盖之前的事件，重新计时

```js
// 防抖
function debounce(fn, delay) {
  let timer = null;
  function debounceFn(...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }
  return debounceFn;
}

// sleep函数
const sleep = async (delay) => {
  return new Promise((resole) => {
    setTimeout(resole, delay);
  });
};

// 测试
const f = debounce((count) => console.log(count), 2000);
(async function () {
  f(1);
  await sleep(1000);
  f(2); // 1000 < 2000 覆盖重新计时
  await sleep(3000);
  f(3); // 3000 > 2000 上一次可执行，打印2
  await sleep(1500);
  f(4); // 1500 < 2000 覆盖重新计时
  await sleep(2500);
  f(5); // 2500 > 2000 上一次可执行，打印4，本次执行打印5
})();
```

延伸到使用 react 的 useEffect 实现一个防抖的 hook

```js
// 防抖
function debounce(fn, delay) {
  let timer = null;
  function debounceFn(...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }
  return debounceFn;
}

// sleep函数
const sleep = async (delay) => {
  return new Promise((resole) => {
    setTimeout(resole, delay);
  });
};

// 测试
const f = debounce((count) => console.log(count), 2000);
(async function () {
  f(1);
  await sleep(1000);
  f(2); // 1000 < 2000 覆盖重新计时
  await sleep(3000);
  f(3); // 3000 > 2000 上一次可执行，打印2
  await sleep(1500);
  f(4); // 1500 < 2000 覆盖重新计时
  await sleep(2500);
  f(5); // 2500 > 2000 上一次可执行，打印4，本次执行打印5
})();

// useDebounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};
```

## new 关键字的实现

```js
const myNew = (...args) => {
  const [fn, ...other] = args;
  // const obj = {};
  // obj.__proto__ = fn.prototype;
  const obj = Object.create(fn.prototype);
  const res = fn.apply(obj, other);
  return res instanceof Object ? res : obj;
};
```

## instanceof 的实现

instanceof 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
const myInstanceof = (left, right) => {
  if (!left && !right) return;
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};

const obj = [];
console.log(myInstanceof(obj, Object));
console.log(myInstanceof(obj, Array));
console.log(myInstanceof(obj, Function));
```

## 封装数据类型函数

```js
const type = (function () {
  const type = Object.create(null);
  const typeArr = [
    'String',
    'Number',
    'Object',
    'Array',
    'Null',
    'Undefined',
    'Boolean',
  ];
  typeArr.forEach((item) => {
    type[`is${item}`] = function (args) {
      return Object.prototype.toString.call(args) === `[object ${item}]`;
    };
  });
  return type;
})();

console.log(type.isArray([]));
console.log(type.isArray({}));
console.log(type.isArray(12));
```

## Promise 相关

```js
// 手写Promise
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function resolvePromise(x, promise, resolve, reject) {
  if (x === promise) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>'),
    );
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}

class MyPromise {
  constructor(execute) {
    this.statue = PENDING;
    this.value = null;
    this.reason = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      execute(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  resolve = (value) => {
    if (this.statue === PENDING) {
      this.statue = FULFILLED;
      this.value = value;
      while (this.onResolvedCallbacks.length) {
        this.onResolvedCallbacks.shift()(this.value);
      }
    }
  };
  reject = (reason) => {
    if (this.statue === PENDING) {
      this.statue = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.reason);
      }
    }
  };
  then(onResolve, onReject) {
    const realOnResolve =
      typeof onResolve === 'function' ? onResolve : (value) => value;
    const realOnReject =
      typeof onReject === 'function'
        ? onReject
        : (reason) => {
            throw reason;
          };
    const newPromise = new MyPromise((resolve, reject) => {
      const resolvedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnResolve(this.value);
            resolvePromise(x, newPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnReject(this.reason);
            resolvePromise(x, newPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };
      if (this.statue === FULFILLED) {
        resolvedMicrotask();
      } else if (this.statue === REJECTED) {
        rejectedMicrotask();
      } else if (this.statue === PENDING) {
        this.onResolvedCallbacks.push(resolvedMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });
    return newPromise;
  }
}

// 测试
// const p = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('666')
//   }, 3000);
//   setTimeout(() => {
//     reject('999')
//   }, 2000)
// })

// p.then(res => {
//   console.log('success1', res);
//   return res;
// }, err => {
//   console.log('error1', err);
//   return err;
// }).then(res => {
//   console.log('success2', res);
//   return res;
// }, err => {
//   console.log('error2', err);
//   return err;
// }).then(res => {
//   console.log('success3', res);
//   return res;
// }, err => {
//   console.log('error3', err);
//   return err;
// })

const promise = new MyPromise((resolve, reject) => {
  resolve('success');
});

// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
const p1 = promise.then((value) => {
  console.log(1);
  console.log('resolve', value);
  return p1;
});

// 运行的时候会走reject
p1.then(
  (value) => {
    console.log(2);
    console.log('resolve', value);
  },
  (reason) => {
    console.log(3);
    console.log(reason.message);
  },
);
```

```js
// Promise.all方法
Promise.prototype._all = function (promiseList) {
  const result = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseList.length; i++) {
      const promise = promiseList[i]();
      promise.then(
        (res) => {
          result.push(res);
          if (result.length === promiseList.length) {
            resolve(result);
          }
        },
        (err) => {
          return reject(err);
        },
      );
    }
  });
};

// Promise.race方法
Promise.prototype._race = function (promiseList) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseList.length; i++) {
      const promise = promiseList[i]();
      promise.then(
        (res) => {
          return resolve(res);
        },
        (err) => {
          return reject(err);
        },
      );
    }
  });
};

// Promise.finally方法
Promise.prototype._finally = function (fn) {
  return this.then((res) => {
    Promise.resolve(fn()).then(
      () => {
        return res;
      },
      (err) => {
        Promise.reject(fn()).then(() => {
          throw err;
        });
      },
    );
  });
};
```

## 单例模式

单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现方法一般是先判断实例是否存在，如果存在直接返回，如果不存在就先创建再返回。

```js
// 闭包实现
const getSingle = function (fn) {
  let result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  };
};

// 使用Proxy拦截
const proxy = function (fn) {
  let result;
  const handler = {
    construct: function () {
      if (!result) {
        result = Reflect.construct(fn, arguments);
      }
      return result;
    },
  };
  return new Proxy(fn, handler);
};
```

## 实现 Object.create 方法

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的**proto**。

```js
Object.prototype._create = function (obj) {
  function F() {}
  F.prototype = obj;
  return new F();
};
```

## 封装 async/await

无需每次使用 async/await 都包裹一层 try/catch

```js
async function errorCaptured(fn) {
  try {
    const res = await fn();
    return [null, res];
  } catch (e) {
    return [e, null];
  }
}

// 使用
const [err, res] = await errorCaptured(asyncFn);
```

## 发布订阅 EventEmitter

通过 on 方法注册事件，trigger 方法触发事件，来达到事件之间的松散解耦，并且额外添加了 once 和 off 辅助函数用于注册只触发一次的事件以及注销事件

```js
class EventEmitter {
  constructor() {
    this.subs = {};
  }
  on(event, cb) {
    (this.subs[event] || (this.subs[event] = [])).push(cb);
  }
  trigger(event, ...args) {
    this.subs[event] &&
      this.subs[event].forEach((cb) => {
        cb(...args);
      });
  }
  off(event, offCb) {
    if (this.subs[event]) {
      const index = this.subs[event].findIndex((cb) => cb === offCb);
      this.subs[event].splice(index, 1);
      if (!this.subs[event].length) delete this.subs[event];
    }
  }
  once(event, onceCb) {
    const cb = (...args) => {
      onceCb(...args);
      this.off(event, onceCb);
    };
    this.on(event, cb);
  }
}
```

## 简易版 Vue3 reactive 数据响应式实现

`reactive`接受一个对象作为参数，其返回值是经`reactive`函数包装过后的数据对象，这个对象具有响应式

```js
const targetMap = new WeakMap();
const effectStack = [];

const isObject = (value) => {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
};

const reactive = (obj) => {
  if (!isObject(obj)) return obj;
  const get = (target, key) => {
    track(target, key);
    const res = Reflect.get(target, key);
    return reactive(res);
  };
  const set = (target, key, value) => {
    trigger(target, key);
    return Reflect.set(target, key, value);
  };
  return new Proxy(obj, {
    get,
    set,
  });
};

// 收集依赖
const track = (target, key) => {
  const activeEffect = effectStack[effectStack.length - 1];
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = []));
  }
  deps.push(activeEffect);
};

// 触发修改属性的回调函数
const trigger = (target, key) => {
  const deps = targetMap?.get(target)?.get(key);
  deps && deps.forEach((dep) => dep());
};

// 监听函数，当fn内用到的对象属性值发生变化时触发执行fn
const effect = (fn) => {
  try {
    effectStack.push(fn);
    fn(); // 首次执行收集依赖
  } finally {
    effectStack.pop();
  }
};

// 测试
let obj = reactive({ a: 1, b: { c: 3 } });
effect(() => {
  console.log(obj.a);
  console.log(obj.b.c);
  console.log('----------');
});
setInterval(() => {
  obj.a++;
  obj.b.c++;
}, 1000);
```

## 自动收集依赖的 useEffect

```js
let activeEffect = null;
const useState = (value) => {
  const fns = new Set();
  const getter = () => {
    if (activeEffect) {
      fns.add(activeEffect);
    }
    return value;
  };
  const setter = (newValue) => {
    value = newValue;
    for (const fn of [...fns]) {
      fn();
    }
  };
  return [getter, setter];
};

const useEffect = (fn) => {
  activeEffect = fn;
  try {
    fn();
  } finally {
    activeEffect = null;
  }
};

// 自动收集依赖的useMemo
const useMemo = (callback) => {
  const [s, set] = useState();
  useEffect(() => set(callback()));
  return s;
};

// 测试useEffect和useState
const [name1, setName1] = useState('1');
const [name2, setName2] = useState('a');
useEffect(() => {
  console.log('name1: ' + name1());
  console.log('name2: ' + name2());
});
setName1('666');
setName2('aaaa');

// 测试useMemo
const [name1, setName1] = useState('KaSong');
const [name2, setName2] = useState('XiaoMing');
const [showAll, triggerShowAll] = useState(true);

const whoIsHere = useMemo(() => {
  if (!showAll()) {
    return name1();
  }
  return `${name1()} 和 ${name2()}`;
});

useEffect(() => console.log('谁在那儿！', whoIsHere()));
```

## 参考

[前端进阶之必会的 JavaScript 技巧总结](https://juejin.cn/post/6945640942976122910)

[一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.cn/post/6844903856489365518#heading-18)
