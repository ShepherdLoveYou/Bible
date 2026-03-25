# 一些关于JS的手写✏️

<BlogHead date="2025-8-4" tags="学习📚"/>

---

### instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。核心逻辑就是：顺着左边对象（实例）的 `proto` 链一直往上找，看能不能找到右边构造函数的 prototype 对象。

```js
function myInstanceof(left, right) {
  // 基础类型直接返回 false（instanceof 只能用于对象）
  if (typeof left !== "object" || left === null) return false

  // 获取左边对象的隐式原型
  let proto = Object.getPrototypeOf(left)
  // 获取右边构造函数的显式原型
  const prototype = right.prototype

  // 顺着原型链循环查找
  while (true) {
    // 找到原型链尽头 (null)，说明没找到
    if (proto === null) return false
    // 找到了，匹配成功
    if (proto === prototype) return true
    // 继续往上找
    proto = Object.getPrototypeOf(proto)
  }
}

// 测试
console.log(myInstanceof([], Array)) // true
console.log(myInstanceof({}, Object)) // true
```

### call函数

```js
Function.prototype.mycall = function (thisArg, ...args) {
  // 如果调用对象不是函数 抛出错误
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function!`)
  }
  // 如果没有传入上下文，则默认使用全局对象
  thisArg = thisArg ?? globalThis
  // 如果传入的上下文不是对象，则将其转换为对象
  thisArg = Object(thisArg)
  // 将函数绑定到上下文对象上并调用函数来隐式绑定this
  thisArg.fn = this
  const result = thisArg.fn(...args)
  // 删除绑定的函数
  delete thisArg.fn

  return result
}
```

### apply函数

```js
Function.prototype.myapply = function (thisArg, argsArry) {
  // 如果调用对象不是函数 抛出错误
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function!`)
  }
  // 如果没有传入上下文，则默认使用全局对象
  thisArg = thisArg ?? globalThis
  // 如果传入的上下文不是对象，则将其转换为对象
  thisArg = Object(thisArg)
  // 将函数绑定到上下文对象上并调用函数来隐式绑定this
  thisArg.fn = this
  const result = thisArg.fn(...(argsArry || []))
  // 删除绑定的函数
  delete thisArg.fn

  return result
}
```

### bind函数

```js
Function.prototype.myBind = function (thisArg, ...args) {
  // 如果调用对象不是函数 抛出错误
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function!`)
  }

  return (...args2) => {
    // 如果没有传入上下文，则默认使用全局对象
    thisArg = thisArg ?? globalThis
    // 如果传入的上下文不是对象，则将其转换为对象
    thisArg = Object(thisArg)
    // 将函数绑定到上下文对象上并调用函数来隐式绑定this
    thisArg.fn = this
    const result = thisArg.fn(...args, ...args2)
    // 删除绑定的函数
    delete thisArg.fn

    return result
  }
}
```

### 函数柯里化

函数柯里化是一种将多参数函数转换为一系列单参数函数的技术。柯里化的核心思想是：将一个接收多个参数的函数，转换成一系列使用一个参数的函数。

- 接收一个普通函数，让函数柯里化
- 返回柯里化后的函数

```js
function currying(fn) {
  return function curried(...args) {
    // 如果传入的参数个数大于等于要改造函数的参数个数，说明参数接收完成
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      // 否则返回一个新的函数，通过递归继续拼接参数，直到参数个数和传入函数的参数个数一致
      return (...args2) => curried.apply(this, [...args, ...args2])
    }
  }
}
```

**优点**：

1. **参数复用**：可以固定部分参数，生成更专用的函数
2. **延迟执行**：可以分步传入参数，直到所有参数都传入才执行
3. **函数组合**：便于进行函数组合和管道操作
