---
title: 使用rinf进行Rust与Flutter的集成与通信
date: 2024-2-10 20:33:00
tags: ["Flutter","Rust","rinf","FFI"]
categories: Development & Progarmming
index_img: https://pixiv.nl/115766745.jpg
banner_img: https://pixiv.nl/115766745.jpg
---

# 使用rinf进行Rust与Flutter的集成与通信

## 前言

Flutter和Rust之间的跨语言调用做着有一段时间了，从去年开始尝试手动写外部函数接口(FFI)，把动态库通过交叉编译手动放进文件夹到现在找一些便利的lib直接用起来，起初用的是FRB(flutter_rust_bridge)，但FRB这东西说实话有点繁重，直接生成一堆文件，我不太喜欢

这几天看到了rinf，觉得用的挺不错的，看了看关于rinf的文章不是很多，于是就稍微写写，如何使用还是建议参考[官方文档](https://rinf.cunarist.com/)

## 安装

安装非常方便，当然了，你得先装好Flutter和Rust

### 添加依赖

找到你的flutter项目根目录(下面简称根目录)运行下面这个命令添加依赖，或者你也可以手动安装

```bash
flutter pub add rinf
```

### 安装CLI工具

在根目录运行这个命令，通过Cargo安装rinf的cli工具

```bash
cargo install rinf
```

安装之后可以再用`rinf --help`看看详细帮助

### 生成模板文件

使用这个命令来一键生成模板文件，模板代码也是文档的一部分，可以参考参考

```bash
rinf template
```

Rust相关的代码编写主要是在 `native/hub/src` 下的，其他的`sample_crate`之类的，可以根据你的需求删除

## 使用

### 编写ProtoBuf

不会编写请先参考[文档](https://protobuf.dev/programming-guides/proto3/)

在messages文件夹下新建`foo.proto`(名称随意)，使用`proto3`进行编写即可

下面这段代码可以进行参考

其中`[RINF:DART-SIGNAL]`(从Dart向Rust传递的信息)和`[RINF:RUST-SIGNAL]`(从Rust向Dart发送的信息)并不是无意义的，rinf会根据这个来生成文件

```proto
syntax = "proto3";
package foo;

// [RINF:DART-SIGNAL]
message DataInput {
    string username = 1;
    string password = 2;
};

// [RINF:RUST-SIGNAL]
message DataOutput {
    string data = 1;
}
```

写完之后，根目录运行`rinf message`就可以看到文件生成了

### Rust侧的编写

首先可以在`hub/src`下新建一个`foo.rs`

```rust
// foo.rs

use crate::messages::foo::{DataInput, DataOutput};

pub async fn handle_data() {
    let mut rev = DataInput::get_dart_signal_receiver();
    while let Some(dart_signal) = rev.recv().await {
        // 处理接受来的信息
        let output: DataOutput = foo(dart_signal.message);
        // 发送
        output.send_signal_to_dart(None);
    }
}
```

然后还需要在主函数里添加一行`spawn`，这样rust侧的编写就完成了

```rust
// ...
fn main {
    // ...
    tokio::spawn(handle_data());
}
```

### Flutter侧的编写

Flutter侧的代码默认会生成在`lib/messages`中，只需要关心`generated.dart`里的内容即可

需要先在主函数添加初始化Rust，并且添加生命周期确保关闭，具体怎么关闭随意，此处仅供参考

```dart
void main() async {
  await initializeRust();
    //...
}

class MyAppState extends State<MyApp> {
  final _appLifecycleListener = AppLifecycleListener(
    onExitRequested: () async {
      await finalizeRust();
      return AppExitResponse.exit;
    },
  );

  @override
  void dispose() {
    super.dispose();
    _appLifecycleListener.dispose();
  }
}
```

然后就可以进行调用了！下面是一个简单的例子

```dart
class FooPageState extends State<FooPage> {
  void update(DataOutput data) => ...

  @override
  void initState(){
    super.initState();
    DataOutput().listen((signal) => update(signal.message));
  }

  @override
  Widget build(BuildContext context) {
    return Button(onTap: () => DataInput(
        username: "Foo",
        password: "Bar",
      ).sendSignalToRust(null)
    );
  }
}
```

