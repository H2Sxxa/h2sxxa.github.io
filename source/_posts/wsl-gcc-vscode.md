---
title: 使用WSL来运行gcc配合VSCode进行C的开发
date: 2023-8-10 17:00:00
tags: ["WSL","Linux","gcc","VSCode"]
categories: Development & Progarmming
index_img: https://pixiv.re/99637663.jpg
banner_img: https://pixiv.re/99637663.jpg
---

# 使用WSL来运行GCC

## 为什么是WSL + GCC

### 什么是MinGW

MinGW全称是Minimalist GNU on Windows，翻译一下就是**用于Windows的简单GNU套件**，里面不仅包含了mingw-gcc/g++用于编译C/C++文件，还包含了许多头文件以及bison，make等工具，可以让你在Windows上轻松开发C/C++程序。

如果你不想使用WSL，你可以参考 [Get Started with C++ and MinGW-w64 in Visual Studio Code](https://code.visualstudio.com/docs/cpp/config-mingw) 这篇文章来为你的VSCode配置MinGW。

### 为什么用WSL

总而言之就是Windows开发体验太蚌埠了，用WSL就不会这么蚌埠。

#### 什么是WSL

WSL的全称是Windows Subsystem for Linux，也就是Windows Linux子系统，在 Windows 10.1607 后存在于Windows系统中。

> 适用于 Linux 的 Windows 子系统可让开发人员按原样运行 GNU/Linux 环境 - 包括大多数命令行工具、实用工具和应用程序 - 且不会产生传统虚拟机或双启动设置开销。
>
> --  [什么是适用于 Linux 的 Windows 子系统 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/about)

同样提供一份官方教程 [Get Started with C++ and Windows Subsystem for Linux in Visual Studio Code](https://code.visualstudio.com/docs/cpp/config-wsl)

#### 对比MinGW

- 可以运行Linux命令
- 使用apt等软件包管理器管理依赖安装
- 更加舒服的GDB调试
- ......

#### 那我想要让我的程序给Windows用啊！

WSL里的gcc编译出来仅能提供给相同平台架构的机器使用，如果你需要多平台，你可以尝试交叉编译，也可以用类似于Github Action的CI来进行编译，总之方法有很多，这个问题随着你的深入会很简单。

那么我们开始吧！

## 前置步骤

如果WSL内核版本较低打开WSL会出现`0x800701bc`错误。

所以我们为解决这个问题需要进行一些小小的操作。

### 开启WSL和虚拟化

使用**管理员身份**打开PowerShell输入

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 升级WSL内核

[点击这里获取WSL升级安装包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

安装升级后，打开PowerShell输入`wsl --set-default-version 2`，然后就大功告成了！

## 安装WSL

[微软提供的教程](https://learn.microsoft.com/zh-cn/windows/wsl/install)

### 🏪微软商店安装

如果安装Ubuntu（WSL）直接在微软商店搜索Ubuntu即可，直接安装就行了。

安装完后打开PowerShell输入`wsl --install`确保安装完整即可。

全部结束后记得`wsl -l -v`看看是否安装成功（当然也可以不看❌）。

### 🔧手动安装

使用下方这行命令可以列出所有可用的 Linux 发行版本（不含一些第三方版本），默认是Ubuntu，我也推荐安装Ubuntu。

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

## 安装GCC

配置好账户密码之后，在Ubuntu（WSL）里逐一运行下方的命令

```bash
sudo sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list #切换阿里云镜像，也可以不切换（X
sudo apt update -y #更新软件包清单
sudo apt upgrade -y #升级软件包
sudo apt-get install build-essential gdb
```

### 检查安装

```bash
whereis g++
whereis gdb
```

至此，如果有成功显示路径，WSL + GCC就算是安装好了。

## 安装VSCode插件

VSCode应用商店搜索WSL，安装有MicroSoft认证的那一个，然后点击底部栏最左侧的图标，选择连接至WSL，然后安装搜索C/C++插件，安装语言扩展包，之后再同时安装至WSL。

调试的时候选择GCC即可，如果是C++的话，调试的时候请选择G++，至此就完成了WSL + GCC + VSCode的开发环境配置。

## 补记：交叉编译

### 交叉编译是什么

简单来说，就是跨平台编译，这里的平台包括但不限于系统架构（x86-64,aarch64......），操作系统（Windows，Linux......）。

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

