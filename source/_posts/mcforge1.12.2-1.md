---
title: MineCraft 1.12.2 开发教程 —— 1.构建环境并启动MC
date: 2022-10-16 14:00:00
tags: ["Minecraft","Forge","1.12.2"]
categories: Minecraft Forge 1.12.2 Development Tutorial
index_img: https://pixiv.re/79639404-1.jpg
banner_img: https://pixiv.re/79639404-1.jpg
---

## 构建环境

### 何为构建环境？

在了解构建环境之前，你需要知道一个名为 **ForgeGradle** 的东西

> ## 1.2. ForgeGradle 能干什么？
>
> - 部署开发环境（下载 Minecraft、反编译及反混淆 Minecraft、下载 assets），有三种：
>   - 基本上所有 Mod 开发者在平时开发 Mod 时都会使用的带反编译出的源码的开发环境（`setupDecompWorkspace` task)
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

{% note warning %}
如果没有耐心，构建环境就足以把你劝退
{% endnote %}

W.I.P.

