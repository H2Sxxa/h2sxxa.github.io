---
title: 异步编程中的阻塞、并发与并行
date: 2024-7-25 15:47:00
tags: ["Dart","Rust","Programming","Async","Tokio"]
categories: Development & Progarmming
index_img: https://pixiv.nl/120811830.jpg
banner_img: https://pixiv.nl/120811830.jpg
---

# 阻塞

## 引言: 什么是 `await` ?

在异步编程中，`await` 是一个很重要的语法，使用 `await` 来解析异步操作等待获取值是很常见的事情，因此，初学异步编程时，我们会理所当然地在所有地方使用 `await`。

但你真的确定你知道 `await` 为你做了什么吗？以及你是否有思考过，这样使用 `await` 最终和同步代码相比究竟有什么不同？

本篇文章就以这两个问题出发，对异步编程进行一些思考，希望对你学习异步编程能有帮助。

如有错误，请不吝赐教！

## await 与阻塞

毫无疑问 `await` 是阻塞的，你可以尝试运行以下的代码。

```rust
#[tokio::test]
async fn await_block() {
    use std::time::Duration;

    async fn foo(count: u64) {
        tokio::time::sleep(Duration::from_secs(count)).await;
        println!("{}", count);
    }

    foo(3).await;
    foo(2).await;
    foo(1).await;
}
```

输出结果是 `3 2 1`

很显然，这一段代码与它的同步的差别不大。

对于一些 GUI程序 来说，阻塞是**致命**的，阻塞意味着停止渲染 UI，这将会导致程序界面的卡死，尽管实际上程序正在运行。

# 并发与并行

## 多线程语言的 join/spawn

```rust
#[tokio::test]
async fn await_block() {
    use std::time::Duration;

    async fn foo(count: u64) {
        tokio::time::sleep(Duration::from_secs(count)).await;
        println!("{}", count);
    }

    tokio::join!(foo(3), foo(2), foo(1)); // tokio::spawn(foo(3)); ...
}
```

输出结果将是 `1 2 3` ~~意味着你可以拿它来写睡眠排序~~

> By running all async expressions on the current task, the expressions are able to run concurrently but not in parallel. This means all expressions are run on the same thread and if one branch blocks the thread, all other expressions will be unable to continue. If parallelism is required, spawn each async expression using tokio::spawn and pass the join handle to join!.
>
> https://docs.rs/tokio/latest/tokio/macro.join.html#runtime-characteristics

`join` 具有并发性, `spawn` 还具有并行性，对于I/O密集型任务，有一段等待返回数据的时间，`join`/`spawn`性能差异不大，这也是异步在I/O密集型场景高效的原因。

CPU密集型任务请使用 `spawn`。

## 在 Dart 中进行并发

著名的单线程语言是 JavaScript，很遗憾，笔者没有接触过这门以函数出名的语言。

不过除了 JavaScript 以外，因 Flutter 而出名的 Dart 也是一门优秀的单线程语言 (尽管 Isolate 令人印象深刻)。

下面这个例子会输出 `1 2 3`

如果在所有调用 `foo` 的地方加上 `await`，那就会变成 `3 2 1`

```dart
void main() async {
    foo(int sec) async =>
        Future.delayed(Duration(seconds: sec)).then((_) => print(sec));

    foo(3);
    foo(2);
    foo(1);

    await Future.delayed(const Duration(seconds: 6));
}
```

# 参考

下面这两篇文章写的非常清晰，推荐阅读

https://bingowith.me/2021/05/09/translation-async-what-is-blocking/

https://medium.com/flutter-community/futures-async-await-threading-in-flutter-baeeab1c1fe3


