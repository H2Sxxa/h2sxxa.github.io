---
title: 使用WSL来运行gcc配合VSCode进行C的开发
date: 2023-8-10 17:00:00
tags: ["WSL","Linux","gcc","VSCode"]
categories: Development & Progarmming
index_img: https://pixiv.re/110404372.jpg
banner_img: https://pixiv.re/110404372.jpg
---

# 使用WSL来运行GCC

## 为什么是WSL + GCC

说到Windows上的C/Cpp编译器，那自然就是MinGW，想要开发适用于Windows的应用程序，那自然可以选择MinGW，没有问题，毕竟Linux编译的程序无法直接用于Windows。

但是MinGW的开发体验非常糟糕，一个项目可能需要手动创建多个配置文件来使用MinGW里的C编译器，相比之下 WSL + GCC 可以自动生成一个`tasks.json`，且不需要额外配置，其次就是WSL（Linux）里安装gcc等开发C/Cpp所用到的工具非常简单，apt-get就完事，远比用Windows舒服。

WSL + GCC编译的程序不能直接用于Windows，后期也可以使用MinGW编译一个发行版，如果能够使用CI（类似于Github Action）编译会很方便，我不认为这是一个缺点。

## 安装WSL

[微软提供的教程](https://learn.microsoft.com/zh-cn/windows/wsl/install)

### 🏪微软商店安装

如果安装Ubuntu（WSL）直接在微软商店搜索Ubuntu也有，直接安装应该也可以使用WSL，安装完后记得`wsl -l -v`看看是否安装成功。



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

### 升级到WSL2（可选）

[比较 WSL 版本](https://learn.microsoft.com/zh-cn/windows/wsl/compare-versions#whats-new-in-wsl-2)

一般使用`--install`安装下来默认就是WSL2了，如果你不放心可以检查检查。

输入下方这行命令就可以查看你安装的Linux的WSL版本了

```powershell
wsl -l -v

#  NAME      STATE           VERSION
#* Ubuntu    Stopped         2
```

升级到WSL2很简单，只需要`wsl --set-version 你所需要升级的Linux的NAME 2`

### 配置账户密码

[微软的教程](https://learn.microsoft.com/zh-cn/windows/wsl/setup/environment#set-up-your-linux-username-and-password)

运行刚才安装好的Ubuntu，或者直接Powershell里运行`wsl`，然后就是首次启动配置账户密码了，输入密码的时候，**终端不会有任何符号输出**，切记要保管好自己的账户密码，不然后面sudo的时候忘记就难受了。

## 安装GCC

配置好账户密码之后，在Ubuntu（WSL）里逐一运行下方的命令

```shell
sudo sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list #切换阿里云镜像
sudo apt update -y #更新软件包清单
sudo apt upgrade -y #升级软件包
sudo apt-get install build-essential gdb
```

### 检查安装

```shell
whereis g++
# g++: /usr/bin/g++ /usr/share/man/man1/g++.1.gz
whereis gdb

# gdb: /usr/bin/gdb /etc/gdb /usr/include/gdb /usr/share/gdb /usr/share/man/man1/gdb.1.gz
```

至此，WSL + GCC就算是安装好了。

## 安装VSCode插件

VSCode应用商店搜索WSL，安装有MicroSoft认证的那一个，然后点击底部栏最左侧的图标，选择连接至WSL，然后安装C/C++插件同时安装至WSL。

调试的时候选择GCC即可，至此就完成了WSL + GCC + VSCode的开发环境配置。

PS:我是按照自己的经验编写本文章的，如有不足，请在评论区指教。



