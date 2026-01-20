---
title: 借用回调在不阻塞地执行 Rust 异步方法
date: 2025-1-28 11:15:00
tags: ["Python","Rust","Programming","Async","Tokio"]
categories: Development & Progarmming
index_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/126570679.jpg&w=800&h=800
banner_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/126570679.jpg&w=800&h=800
---

# 引言

最近在思考如何不阻塞 UI 地做到调用 Rust 的异步方法，先前的处理都是使用 `tokio::runtime::Runtime::block_on` 把异步方法转换成同步处理，这样处理没什么问题但是把UI卡了留给了另一方处理不太好。

受到 Dart 的 `Future.then` 启发，也许可以同样传递一个回调给异步任务来接收返回值。

## Rust 部分

### 1. 创建异步运行时

首先需要运行异步代码需要 `Runtime`，因为我们没有 `tokio::main`，所以我们需要创建并锁定一个共用的 `Runtime`，这里采用了 `LazyLock`，也可以用别的。

```rust
use std::sync::LazyLock;
use tokio::runtime::Runtime;

pub static RT: LazyLock<Runtime> =
    LazyLock::new(|| Runtime::new().expect("Create Tokio Runtime failed!"));
```

### 2. 编写异步方法

`extern "C" fn()` 可以表示以 C 的 ABI 标准传递来的函数，用 `sleep` 模拟一下耗时操作然后就调用回调吧。

```rust
use std::time::Duration;
use tokio::time::sleep;

#[no_mangle]
pub extern "C" fn call_when_complete_future(callback: extern "C" fn()) {
    RT.spawn(async move {
        println!("Will Call callback after 3secs");
        sleep(Duration::from_secs(3)).await; // Complex Operation here
        callback();
    });
}
```

### 3. 完整代码

```rust
use std::sync::LazyLock;
use std::time::Duration;
use tokio::runtime::Runtime;
use tokio::time::sleep;

pub static RT: LazyLock<Runtime> =
    LazyLock::new(|| Runtime::new().expect("Create Tokio Runtime failed!"));

#[no_mangle]
pub extern "C" fn call_when_complete_future(callback: extern "C" fn()) {
    RT.spawn(async move {
        println!("Will Call callback after 3secs");
        sleep(Duration::from_secs(3)).await; // Complex Operation here
        callback();
    });
}
```

## Python 部分

Python 部分随便写写，用过 `ctypes` 的用户应该都会，注意`dll.call_when_complete_future(STATIC_CALLBACK)`中的`STATIC_CALLBACK`最好设置为全局变量，否则离开作用域后调用可能会崩溃...

```python
from ctypes import CDLL, CFUNCTYPE, c_void_p
from time import sleep

dll = CDLL(".../path/to/dynamic/library/so/or/dll")
CNativeCallbackType = CFUNCTYPE(restype=c_void_p)
dll.call_when_complete_future.argtypes = [CNativeCallbackType]

stop_logic = False


def native_func_impl():
    global stop_logic
    print("Hello world, I am callback!")
    stop_logic = True


STATIC_CALLBACK = CNativeCallbackType(native_func_impl)
dll.call_when_complete_future(STATIC_CALLBACK)

frame = 0
while not stop_logic:
    # Render UI/...
    frame += 1
    print(f"render frame: {frame}")
    sleep(1)


print(f"frame: {frame}")
```

## 最终结果

```
render frame: 1
Will Call callback after 3secs
render frame: 2
render frame: 3
render frame: 4
Hello world, I am callback!
```

也许这样的回调处理也是跨语言的解决方案之一，留着日后再研究了。