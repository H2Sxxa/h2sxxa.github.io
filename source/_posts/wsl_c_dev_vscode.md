---
title: 在VSCode里通过WSL进行C的开发
date: 2023-8-10 17:00:00
tags: ["WSL","Linux","C","VSCode"]
categories: Development & Progarmming
index_img: https://pixiv.nl/99637663.jpg
banner_img: https://pixiv.nl/99637663.jpg
---


## 我只想看看怎么配置MinGW

MinGW全称是Minimalist GNU on Windows，翻译一下就是**用于Windows的简单GNU套件**，里面不仅包含了mingw-gcc/g++用于编译C/C++文件，还包含了许多头文件以及bison，make等工具，可以让你在Windows上轻松开发C/C++程序。

如果你不想使用WSL，你可以参考 [Get Started with C++ and MinGW-w64 in Visual Studio Code](https://code.visualstudio.com/docs/cpp/config-mingw) 这篇文章来为你的VSCode配置MinGW。

## 什么是WSL

WSL的全称是Windows Subsystem for Linux，也就是Windows Linux子系统，在 Windows 10.1607 后存在于Windows系统中。

> 适用于 Linux 的 Windows 子系统可让开发人员按原样运行 GNU/Linux 环境 - 包括大多数命令行工具、实用工具和应用程序 - 且不会产生传统虚拟机或双启动设置开销。
>
> --  [什么是适用于 Linux 的 Windows 子系统 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/about)

同样提供一份官方教程 [Get Started with C++ and Windows Subsystem for Linux in Visual Studio Code](https://code.visualstudio.com/docs/cpp/config-wsl)

## 为什么是WSL

总而言之就是Windows开发体验太蚌埠了~~(说的就是你MSVC)~~，而Linux好很多，而且软件包管理起来也很方便。


### 我想要让我的程序给Windows用啊！

WSL里的C编译器编译出来仅能提供给相同平台架构的机器使用，如果你需要多平台，你可以尝试交叉编译，也可以用类似于Github Action的CI来进行编译，总之方法有很多，这个问题随着你的深入会很简单。

补记有关于如何在WSL进行交叉编译可以供你简单参考。

那么我们开始吧！

## 前置步骤

为了确保你的WSL功能可用我们用命令行先把功能打开

### 开启WSL和虚拟化

使用**管理员身份**打开PowerShell输入

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

然后重启一下电脑，可能会进行系统更新w


### 升级WSL内核

电脑默认是WSL1内核，我们把它升级到WSL2，以防出现`0x800701bc`错误。

[点击这里获取WSL升级安装包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

安装升级后，打开PowerShell输入`wsl --set-default-version 2`，然后就大功告成了！（也可以不输，似乎默认就是WSL2了现在）

## 安装WSL的Linux分发版

[微软提供的教程](https://learn.microsoft.com/zh-cn/windows/wsl/install)

### 微软商店安装

如果安装Ubuntu（WSL）直接在微软商店搜索Ubuntu即可，直接安装就行了。

安装完后打开PowerShell输入`wsl --install`确保安装完整即可。

全部结束后记得`wsl -l -v`看看是否安装成功（当然也可以不看❌）。

### 手动安装

使用下方这行命令可以列出所有可用的 Linux 发行版本（不含一些第三方版本），默认是Ubuntu，我也推荐安装Ubuntu，比较省事。

~~当然如果你想要折腾也可以去找个ArchLinux~~

```powershell
wsl -l -o
# wsl --list --online
#以下是可安装的有效分发的列表。
#使用 'wsl.exe --install <Distro>' 安装。

#NAME                                   FRIENDLY NAME
#Ubuntu                                 Ubuntu
#Debian                                 Debian GNU/Linux
#kali-linux                             Kali Linux Rolling
#Ubuntu-18.04                           Ubuntu 18.04 LTS
#Ubuntu-20.04                           Ubuntu 20.04 LTS
#Ubuntu-22.04                           Ubuntu 22.04 LTS
#OracleLinux_7_9                        Oracle Linux 7.9
#OracleLinux_8_7                        Oracle Linux 8.7
#OracleLinux_9_1                        Oracle Linux 9.1
#openSUSE-Leap-15.5                     openSUSE Leap 15.5
#SUSE-Linux-Enterprise-Server-15-SP4    SUSE Linux Enterprise Server 15 SP4
#SUSE-Linux-Enterprise-15-SP5           SUSE Linux Enterprise 15 SP5
#openSUSE-Tumbleweed                    openSUSE Tumbleweed
```

输入这行就会自动开始安装WSL了

```powershell
wsl --install -d Ubuntu
```

### 配置账户密码

[微软的教程](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#set-up-your-linux-username-and-password)

运行刚才安装好的Ubuntu，或者直接Powershell里运行`wsl`，然后就是首次启动配置账户密码了，输入密码的时候，**终端不会有任何符号输出**，切记要保管好自己的账户密码，不然后面sudo的时候忘记就难受了。

## 选择你的编译器

编译器简单来说就是将源代码经过一系列处理变为二进制文件的一个软件，如果你想了解更多，请查看编译原理

C的编译器有很多，主流的有GCC，Clang，MSVC，而GCC是跨平台的，MSVC是Windows独享~~（都叫MicroSoft Visual C/C++了）~~，Clang的编译只能在Linux/MacOS这些平台使用

在本教程中你可以选择安装GCC或Clang，Clang虽然比GCC相比有很多优点（速度快，占用小），但是可能需要再折腾，在大部分的C语言指导书里普遍使用的是GCC，如果你是一个Newer，在没有把握的前提下，我推荐你使用GCC而不是Clang

### GCC

```sh
sudo sed -i 's/http:\/\/cn.archive.ubuntu.com/https:\/\/mirror.sjtu.edu.cn/g' /etc/apt/sources.list #切换SJTU镜像 https://mirror.sjtu.edu.cn/docs/ubuntu
sudo apt update -y #更新软件包清单
sudo apt upgrade -y #升级软件包
sudo apt-get install build-essential gdb
```

安装完后请检查安装

```sh
whereis g++
whereis gdb
```

### Clang


```sh
sudo sed -i 's/http:\/\/cn.archive.ubuntu.com/https:\/\/mirror.sjtu.edu.cn/g' /etc/apt/sources.list #切换SJTU镜像，详见 https://mirror.sjtu.edu.cn/docs/ubuntu
sudo apt update -y #更新软件包清单
sudo apt upgrade -y #升级软件包
sudo apt-get install clang clangd lldb cmake
```

安装完后请检查安装

```sh
whereis clang
whereis clangd
whereis lldb
whereis cmake
```

如果你愿意可以选择再装一个build-essential，以后可能会用到

## 安装VSCode

请认准 https://code.visualstudio.com/ 下载

如果下的太慢可以扔进去这个链接下载 https://d.serctl.com/ 或者自寻安装包

### 安装VSCode插件

如果你需要中文的VSCode，你可以安装一个Chinese (Simplified)插件

当你准备好后，安装一个 WSL 插件，然后点击位于左下角的打开远程窗口选择`连接到WSL`

之后就可以安装C/C++的插件

下面是我推荐的插件(不包含make插件)

 - C/C++
   - Clangd依赖于此
 - Clangd
   - 代码分析提示
 - Code Runner
   - C/C++ Runner运行有点纸张，建议用这个运行，不支持调试
 - C/C++ Runner
   - 建议只用于调试
 - CodeLLDB
   - C/C++ Runner依赖于此

下面这些不是必须的，但是可以改进体验

 - VSCodeSnap
   - 截图插件
 - C/C++ Snippets
   - 代码模板
 - FiraCode
   - 连字字体
 - Error Lens
   - 改进错误信息的外观

### 开始开发

你需要先在你的 home 目录新建一个英文文件夹用于存放你的源代码，然后用VSCode连接到WSL打开此文件夹即可。

打开文件夹后，新建`main.c`或者叫`test.c`什么样都可以，但不要使用中文名称，之后就可以开始你的编写了！

## 补记：交叉编译

### 交叉编译是什么

简单来说，就是跨平台编译，从平台A编译平台B可以用的二进制文件，这里的平台包括但不限于系统架构（x86-64,aarch64......），操作系统（Windows，Linux......）。

### WSL交叉编译Windows可执行程序

#### 安装MinGW

只需一行命令即可。

```bash
sudo apt-get install mingw-w64
```

安装结束后，使用以下命令检查安装。

- i686对于32位系统

- x86_64对应64位系统

```bash
whereis i686-w64-mingw32-gcc
whereis i686-w64-mingw32-g++
whereis x86_64-w64-mingw32-gcc
whereis x86_64-w64-mingw32-g++
```

#### 使用方法

示例：如果我需要编译一个Windows x64的可执行文件只需`x86_64-w64-mingw32-gcc -o 输出文件路径.exe 源代码路径.c`

## 后记：解决`Math.h`无法引用

[详见这位的博客，点击即可跳转](https://nanodaovo.github.io/2023/10/19/debug-mathh)
