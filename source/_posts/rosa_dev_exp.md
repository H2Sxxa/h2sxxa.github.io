---
title: ROSA开发总结
date: 2023-7-11 14:00:00
tags: ["Dart","Flutter","Gradle"]
categories: Development & Progarmming
index_img: https://pixiv.re/109368457.jpg
banner_img: https://pixiv.re/109368457.jpg
---

# 关于ROSA

ROSA其实并不是我写出来的第一个配置环境的工具，但可能是最后一个，因为ROSA的功能将会完备，不需要再去立项了，这就是所谓的继承前者并拓展，我开发Kekkai的时候也是抱着这种想法。

为什么叫ROSA？我当初立项的时候想到了一张符卡「Subterranean Rose」，但因为Rose念得不顺口就改成了它的异变体Rosa（笑）。

## 注意

**本博客仅代表个人观点，可能有些错误，请自行辨别，欢迎评论指出。**

# 关于开发中研究

ROSA镜像修补功能的想法起初是我看到了IDF中炸鸭写的[mirror.gradle](https://github.com/IdeallandEarthDept/IdeallandFramework/blob/master/mirror.gradle)，结合了此前知道jar的本质是一个zip，可使用zip的方法对其进行操作，我就想那我重新编译一些class然后注入jar中是不是就可以实现镜像修补？

我就尝试Fork了FG、RFG并编译，但由于编译失败（后来成功了，但用不上了 X），我与[cdc12345](https://github.com/cdc12345)（后文简称cdc）深度讨论研究了一下，他给了我另一种思路，直接提取class来用jbytemod来修改字符串，再重新弄进jar中。

## Gradle生成缓存顺序

我们都知道Gradle下载的包在`.gradle/caches/modules-2/file-2.1`中，但`.gradle/caches/jar-9`中也能找到几倍大于前者的同名jar。

我又和cdc讨论了一下，他使用工具帮我确定了一下Gradle使用jar位于jar-9中（感谢cdc），我尝试把jar-9给删了，然后重新运行`./gradlew`，结果是jar-9重新生成了，我就推测jar-9来源于file-2.1，并且在Gradle初始化时生成，事实证明应该我想的没错。

（后来又研究了一下jar-9的jar为什么体积能达到file-2.1的三倍之多，原因是压缩时算法不同，jar-9可能是使用了STORE模式来压缩（仅存储），而file-2.1（打包jar）则是使用了特定的算法来进行压缩）



确定了jar的位置，由于我环境里只有FG的分支RFG，所以我首先先对RFG的常量类下手了，天真的我以为只要修改了常量类中的字符串就可以实现jar全局的修改。

## 编译的常量与反编译的巨坑

在我实现修改常量类，写入jar时，我发现p用没有，ok，我以为是程序出了问题，那我自然是手动修改了一下jar中class，发现也是p用没有，我就想，这件事可能没我想的那么简单（1 WEEK AFTER）那我又回去看了看炸鸭老师写的mirror.gradle，我发现他修改的不仅仅是常量类，还涉及到了很多引用常量的类，于是我就随便拆了一个class出来，用记事本打开（标准结局），我发现里面本该引用常量类的地方是一些字符串，那我就明白了，javac在编译这种常量引用的时候会直接使用常量替换引用。

于是我把所有class都修改了，再手动塞进了jar中，经过测试，的确是成功了。

看到有所成果，我火速完善了ROSA的镜像修补功能，当我以为这一切都要结束的时候，我发现又出现了一些问题。

## Dart的archive库与7za.exe

我的解压缩部分都是使用Dart的archive库来编写的，我以为天下的zip除了压缩等级不同，就没有什么区别了，jar能成功被archive解压，也使我确信能够重新打包回jar。

修补完成后，我运行Gradle命令构建环境，起初是正常进行，但到了后面又爆了`不支持的lambda task`这类的错误（SEVERAL DAYS AFTER）我经过反反复复的控制变量实验终于搞明白了问题就是出在打包上，于是我研究了一晚上archive库，了解到有zlib压缩，zip压缩......经过对这些东西的尝试，我发现archive问题是真的多啊，各种报错与错误生成......我直接光速放弃寻找替代品。

### 感觉不如7za.exe

由于我之前有过开发压缩软件的经验，我就选择了`Process.runSync`与7-zip中提取的`7za.exe`来实行我的解压缩，事实证明这很成功，感觉Windows平台上archive库真打不过`Process.runSync(7za.exe,["a",...])`

（不用Dart调用C而是直接用exe同时有水平不够和懒的原因 X）

# 总结

ROSA开发还是让我学到了不少东西，希望我踩的坑对你有帮助，感谢阅读，也感谢cdc对我的帮助。

项目地址：https://github.com/H2Sxxa/Rosa 欢迎Star，issue，PR与使用。