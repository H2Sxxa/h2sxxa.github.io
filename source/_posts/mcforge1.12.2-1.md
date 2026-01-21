---
title: MineCraft 1.12.2 开发教程 —— 1.构建环境并启动MC
date: 2022-10-16 14:00:00
tags: ["Minecraft","Forge","1.12.2"]
categories: Minecraft Forge 1.12.2 Development Tutorial
index_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/79639404-1.png&w=800&h=800
banner_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/79639404-1.png&w=800&h=800
---

## 构建环境

### 何为构建环境？

在了解构建环境之前，你需要知道一个名为 **ForgeGradle** 的东西，它的作用如下

> - 部署开发环境（下载 Minecraft、反编译及反混淆 Minecraft、下载 assets），有三种：
>  - 基本上所有 Mod 开发者在平时开发 Mod 时都会使用的带反编译出的源码的开发环境（`setupDecompWorkspace` task)
>   - 持续集成服务器（CI）经常使用的用于自动构建 Mod 的环境（`setupCIWorkspace` task）
>   - 不太常用的仅有反混淆后的 Minecraft 的开发环境（`setupDevWorkspace` task）
> - 依赖处理
>   - 用于反混淆依赖项目的 scope（`deobfCompile` 和 `deobfProvided`），在开发跨 Mod 兼容或扩展 Mod 时经常用到
> - IDE 相关
>   - 自动生成 IntelliJ IDEA 的 Run/Debug Configuration（`genIntellijRuns` task）
> - 连带当前项目一起运行 Minecraft（不常用）：
>   - 运行服务器（`runServer` task）
>   - 运行客户端（`runClient` task）
> - 在执行 Gradle Java 插件的 `build` task 时可自动完成对源码的重混淆
> 
> 作者：3TUSK 出处：https://harbinger.covertdragon.team/chapter-01/forgegradle.html

简单来说，构建环境就是把整个MC下到.gradle缓存里，同时进行几轮的反编译反混淆，便于 `runClient` 运行客户端调试与执行其他Gradle命令

### 开始之前

在开始之前，你需要清楚以下几点

- Forge的maven仓库位于国外，下载极易失败 (指某fastutil.jar 20MB+)
- 由于某些硬件软件问题，并不是所有人配置开发环境都能顺利 (1G/环境变量/......)
- 由于各种奇怪的操作，版本问题......只要有一个环节出了问题，基本就可以看见 `Build Failed` 了

难道真的没有办法了吗？

答案是否，在长期的开发者开发过程中已经形成了几套优秀的方案，下文提供2个解决方案来解决构建环境的绝大多数网络问题，当然如果并非是网络问题，可以删除.gradle再次重试

> 是的，因为各种乱七八糟的原因，部署环境的过程总是会有各种莫名其妙的问题。一般情况下， --debug、--stacktrace 直接莽拿到的信息足够 debug 用了。但有一点请注意：部署环境的过程中，因为涉及到几轮 mapping 和下载 Minecraft 的 assets，所以在没有预先部署好的环境留下的缓存的情况行，这个过程不会特别快。要有耐心。
>
> 然而，由于某些特殊原因，即使你有足够的耐心也不一定能部署成功。遇到这种情况时，你可以尝试通过为 Gradle 配置代理。相关资料很容易找到，这里不再赘述。
>
> 此外，还要明确一点：不是所有的错误都和网络有关系。请不要盲目尝试各种所谓的解决方案——虽然，直接删了 .gradle 缓存目录可以解决 90% 的非网络因素引发的问题。
>
> 作者：3TUSK 出处：https://harbinger.covertdragon.team/chapter-02/

- [Proxifier or TUN模式代理Gradle](https://github.com/IAXRetailer/MCreator_Setup/wiki/%E5%A6%82%E4%BD%95%E6%AD%A3%E7%A1%AE%E4%BB%A3%E7%90%86Forge(java)%E6%9D%A5%E5%8A%A0%E9%80%9F%E6%9E%84%E5%BB%BA%E7%8E%AF%E5%A2%83)

- 使用代理镜像Maven源，类似于阿里云....，也有现成的框架，类似于[IDF](https://github.com/IdeallandEarthDept/IdeallandFramework)，不过你可能需要把[build.gradle这部分](https://github.com/IdeallandEarthDept/IdeallandFramework/blob/master/build.gradle#L42)改为下文那样，从而使用2847版本的MDK，不过2768其实也影响不大...看个人选择吧

  ```java
  minecraft {
      version = "1.12.2-14.23.5.2847" //改为1.12.2-14.23.5.2847，此处已更改
      runDir = "run"
  
      // the mappings can be changed at any time, and must be in the following format.
      // snapshot_YYYYMMDD   snapshot are built nightly.
      // stable_#            stables are built at the discretion of the MCP team.
      // Use non-default mappings at your own risk. they may not always work.
      // simply re-run your setup task after changing the mappings to update your workspace.
      mappings = "snapshot_20171003"
      // makeObfSourceJar = false // an Srg named sources jar is made by default. uncomment this to disable.
  }
  
  ```





### 一些修改建议

#### 修改Gradle版本至4.9

1. 打开MDK目录下gradle\wrapper文件夹
2. 打开gradle-wrapper.properties文件
3. 将内容改为下文所述，其中distributionUrl的是否使用腾讯云镜像是可选的，如果不需要使用镜像，可以把distributionUrl的值改为`https\://services.gradle.org/distributions/gradle-4.9-all.zip`

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
# Tecent cloud mirror
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-4.9-all.zip
# Source address
#distributionUrl=https\://services.gradle.org/distributions/gradle-4.9-all.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

### 开始构建！

打开MDK目录下的README.txt，你会看到以下内容

```
Step 1: Open your command-line and browse to the folder where you extracted the zip file.

Step 2: Once you have a command window up in the folder that the downloaded material was placed, type:

Windows: "gradlew setupDecompWorkspace"
Linux/Mac OS: "./gradlew setupDecompWorkspace"

Step 3: After all that finished, you're left with a choice.
For eclipse, run "gradlew eclipse" (./gradlew eclipse if you are on Mac/Linux)

If you prefer to use IntelliJ, steps are a little different.
1. Open IDEA, and import project.
2. Select your build.gradle file and have it import.
3. Once it's finished you must close IntelliJ and run the following command:

"gradlew genIntellijRuns" (./gradlew genIntellijRuns if you are on Mac/Linux)

Step 4: The final step is to open Eclipse and switch your workspace to /eclipse/ (if you use IDEA, it should automatically start on your project)

```

大致的意思由以下几个步骤组成

1. 在你的mdk目录下打开CMD或者PowerShell窗口
2. 输入`gradlew setupDecompWorkspace`
3. 如果你使用eclipse等上述任务结束后输入`gradlew eclipse`
4. 如果你使用IntelliJ IDEA，等上述任务结束，**先选择build.gradle把项目导入IDEA后关闭IDEA**，在确保IDEA关闭后输入`gradlew genIntellijRuns` 
   - 如何导入build.gradle? File->Open->选择你的build.gradle后点击ok，把作为项目打开

1. VSCode在ForgeGradle2.3没有相应的Gradle Task，如果你使用LCF，此处你直接导入即可（记得装Gradle插件）

### 构建失败？

如果你构建成功了请跳过此步

先前往[这里](https://mouse0w0.github.io/setup-mdk-guide)查询有无与你相似的错误，使用对应的方案解决，如果没有可以选择向他人求助

## 在IDE中启动MC

### IDEA

IDEA入成功后，拉出右边的Gradle标签，会有对应的任务，运行`runClient`即可启动客户端

### VSCode(不支持FG2.3)

安装Gradle插件后，在Gradle选项卡处可以找到你的`runClient`

### 手动启动

在项目目录打开终端运行`.\gradlew runClient`

## 参考

[^1]: Harbinger https://harbinger.covertdragon.team
