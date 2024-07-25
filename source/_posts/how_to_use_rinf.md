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

找到你的 Flutter 项目根目录(下面简称根目录)运行下面这个命令添加依赖，或者你也可以手动安装

```bash
flutter pub add rinf
```

安装之后可以使用`rinf --help`看看详细帮助

### 生成模板文件

使用这个命令来生成模板文件，模板代码也是文档的一部分，推荐进行参考

```bash
rinf template
```

Rust相关的代码编写主要是在 `native/hub/src` 下

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

如果你需要一个数组或者可选参数

```proto
message Foo {
    repeated string vec = 1;
    optional string opt = 2;
}
```

如果需要引用其他proto文件中的类型

```proto
import "path/to/foo.proto";

message Bar {
    foo.Foo data = 1;
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

需要先在主函数添加初始化Rust，并且添加生命周期确保关闭

在生成模板时，会帮你自动添加初始化的代码

```dart
void main() async {
  //...
  await initializeRust(assignRustSignal);
  //...
}

class MyAppState extends State<MyApp> {
  final _appLifecycleListener = AppLifecycleListener(
    onExitRequested: () {
      finalizeRust();
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

然后就可以进行调用了！下面是一个简单的例子。

```dart
class FooPageState extends State<FooPage> {
  void update(DataOutput data) => ...

  late StreamSubscription<RustSignal<DataOutput>> _streamDataOutput;

  @override
  void initState(){
    super.initState();
    _streamDataOutput = DataOutput.rustSignalStream.listen((signal) => update(signal.message));
  }


  @override
  void dispose(){
    super.dispose();
    _streamDataOutput.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Button(onTap: () => DataInput(
        username: "Foo",
        password: "Bar",
      ).sendSignalToRust()
    );
  }
}
```

更推荐使用 `StreamBuilder`，代码更加清晰。


```dart
class FooPageState extends State<FooPage> {
  @override
  void initState(){
    super.initState();
    DataInput(
      username: "Foo",
      password: "Bar",
    ).sendSignalToRust()
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: DataOutput.rustSignalStream, 
      builder: (context, snapshot){
        var signal = snapshot.data;
        if (signal == null){
          return ...
        }

        return Button(onTap: () => DataInput(
            username: "Foo",
            password: "Bar",
          ).sendSignalToRust()
        );
      }
    );    
  }
}
```