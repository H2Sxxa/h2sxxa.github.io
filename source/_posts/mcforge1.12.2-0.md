---
title: MineCraft 1.12.2 开发教程 —— 0.准备工作
date: 2022-10-16 8:00:00
tags: ["Minecraft","Forge","1.12.2"]
categories: Minecraft Forge 1.12.2 Development Tutorial
index_img: /img/pixiv/101891205.jpg
banner_img: /img/pixiv/101891205.jpg
---

## 须知

- 这是Minecraft Forge Mod教程而不是Minecraft Bedrock Mod或者Minecraft Farbic Mod
- 本文不讨论MCreator，只讨论古典法：使用Java语言，在Forge的基础上做mod
- 使用的Forge MDK版本为**Forge 14.23.5.2847**，其他版本请勿反复提问
- MacOS用户观看此教程请自力更生

## 前言

在您开始阅读此教程前，请先回答以下几个问题

### 你懂Java吗 or 你知道面向对象的含义吗 ？

- 简述instanceof

- 简述面向对象

- 简述装饰器

- 简述类/包

- ......

  如果你不懂，当然没有关系，因为笔者刚接触时也不懂Java，也是通过一路的摸爬滚打才弄明白的，你现在Go to learn Java还不算迟

  > 有些人会编程但不会Java，这很正常，毕竟世界上有那么多编程语言，正常人都不会样样精通。
  >
  > 如果你懂面向对象，那么找一个介绍java语法的教程即可。这里我推荐菜鸟教程——https://www.runoob.com/java/java-tutorial.html
  >
  > 适合会编程的人，没什么废话。不适合完全不会编程的新手。
  >
  > 作者：道家深湖 https://www.bilibili.com/read/cv12067660 出处：bilibili

### 你有IDE吗？

如果没有，这里有3个选择：

- [IntelliJ IDEA Community](https://www.jetbrains.com/idea/download) (当然，如果你有钱可以选择UItimate，不过这并不影响开发)
- [Eclipse](https://www.eclipse.org/downloads)
- [Visual Studio Code](https://code.visualstudio.com/Download)

这里推荐使用IDEA Community版本，推荐的版本为最新版，因为绝大多数的开发者使用的为此软件，便于提问

不过在本教程中，笔者将使用VSCode来示范代码，不必担心，对于IDEA部分必要功能我也会提，但是对于Eclipse我就爱莫能助了

### 你有Java吗？

如果你想要开发1.12.2的Mod，你需要一个Java8 (JDK)

- [AdoptOpenJDK](https://adoptopenjdk.net/)
- [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
- ......

下载太慢？试看看[清华源](https://mirrors.tuna.tsinghua.edu.cn/Adoptium/8/jdk/x64/windows/)，注意下载.msi而不是zip，除非你完全能区分明白这2东西

等等，还没完，当你安装完成之后，请务必检查一下JAVA_HOME，不过你也可以在IDE里设置项目SDK，然后在IDE里构建开发...

对于我来说，JAVA_HOME在没有多版本开发需求下是较优选；不会配置JAVA_HOME？[点击此处](https://www.runoob.com/java/java-environment-setup.html)

### 你有MDK吗 ？or MDK是什么？

MDK（Mod Development Kit）是Forge提供的一个工具，集成了ForgeGradle以及其他东西

所有1.12.2的MDK可以在[这里](https://files.minecraftforge.net/net/minecraftforge/forge/index_1.12.2.html)找到

- MDK2847下载地址 https://maven.minecraftforge.net/net/minecraftforge/forge/1.12.2-14.23.5.2847/forge-1.12.2-14.23.5.2847-mdk.zip

#### 考虑使用自建框架进行开发

##### IDF(Idealland Framework) - 适合完全 0 基础的小白

https://github.com/IdeallandEarthDept/IdeallandFramework

> IDF，Idealland Framework（理想境框架），是指基于理想境mod源码删减之后得出的一台框架。
>
> IDL，Idealland，理想境的简称。
>
> MDK，Mod Development Kit，模组开发包的简称。 
>
> 作者：道家深湖 https://www.bilibili.com/read/cv19031222 出处：bilibili

值得一提的是，IDF几乎为您配好了所有镜像环境，因此在下一步构建环境也会轻松许多

如果不需要IDF提供的代码，那我推荐你使用LCF



##### LCF(LunarCapitalFrameWork) - 适合有其他语言基础的小白

https://github.com/TeamGensouSpark/LunarCapitalFramework

LunarCapitalFrameWork（月都框架），是由我基于IDF与Cleanroommc的TDE框架整合而成的另一类框架。

与TDE一样配备了 **Gradle 8.1.1** + **[RetroFuturaGradle](https://github.com/GTNewHorizons/RetroFuturaGradle)** + **Forge 14.23.5.2847**，但并不是全镜像

额外还将打算支持添加项目生成器与管理器脚本（依赖于Python）



### 需要更多帮助 or 看看其他的教程

> 1【视频，1.12.2】深湖出品的《边睡觉边开发Mod》
>
> - https://www.bilibili.com/video/BV1Ar4y1K7Qk
>
> 2【网页，1.12.2】由3TUSK牵头的教程《Harbinger》
>
> - https://harbinger.covertdragon.team/
>
> 3【书籍，1.12.2】由土球（zzzz_ustc）撰写的书籍《我的世界：Minecraft模组开发指南》
>
> - 各大网购平台有售，搜索书名即可。
>
> 4【网页，1.16】由FledgeXu撰写的《Boson》。不过由于作者本人已经不打算维护，所以本教程需要在熟练Modder监护下阅读，不然你可能上来就卡住。
>
> - https://boson.v2mcdev.com/introducation/intro.html
>
> 5【汇总】MCBBS的教程帖汇总。很多，不算全，我推荐的就是上面那几个了。除了汇总贴，bbs也有很多其他资源可供各位自行发掘。
>
> - https://www.mcbbs.net/thread-54579-1-1.html
>
> 6【离线包】离线包汇总。对于那些因为在大陆网络受限，而构建工作环境失败的人会有帮助。
>
> - https://www.mcbbs.net/thread-896542-1-1.html
>
> 7【MCWiki】作为modder，有的时候你需要查mc原版的一些信息，来这就对了。
>
> - https://minecraft.fandom.com/zh/wiki/
>
> 8【mod集散地】Curseforge，国际Mod汇总处，你想知道这世界上都有什么mod吗？
>
> - https://www.curseforge.com/minecraft/mc-mods
>
> 9【中文Mod百科】MCMod，中文的mod wiki。虽然不是世界上所有mod都有，但也相当不错了。
>
> - https://www.mcmod.cn/
>
> 10【Github】Github就是github。
>
> - 链接略，国内不稳定 
>
> 作者：道家深湖 https://www.bilibili.com/read/cv12067660 出处：bilibili

#### 补充

- MDK 配置指南 https://mouse0w0.github.io/setup-mdk-guide
- MDK 开发指南 https://github.com/mouse0w0/MinecraftDeveloperGuide
- 一个由我提供的MOD开发群组 https://jq.qq.com/?_wv=1027&k=c14qiAAd

## 再次检查然后开始吧

### 确认Java版本（此步仅MDK）

打开PowerShell or CMD输入

````shell
java -version
````

如果一切正常，看起来会是这样的

```shell
C:\Users\Administrator>java -version
java version "1.8.0_..."
Java(TM) SE Runtime Environment (build 1.8.0_...)
Java HotSpot(TM) 64-Bit Server VM (build ..., mixed mode)
```

请确认java version是**1.8.0**而不是其他(" _ "后面可以忽略)，或者你可以在你的IDE里面更改项目SDK

## 参考
[^1]: Harbinger https://harbinger.covertdragon.team
[^2]: 道家深湖指路明灯等文章 (出处文中均有提到)