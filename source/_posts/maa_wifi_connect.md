---
title: MAA通过无线调试连接手机运行
date: 2023-03-18 18:30:00
tags: ["Arknights","MAA","Android"]
categories: Share & Misc
index_img: https://wsrv.nl/?url=pixiv.nl/97389556.jpg&w=800&h=800
banner_img: https://wsrv.nl/?url=pixiv.nl/97389556.jpg&w=800&h=800
---

## 1.前言

MAA是什么，可以自己去 [[此处](https://github.com/MaaAssistantArknights/MaaAssistantArknights)] 了解，官网为 `maa.plus` ，其他连接方式（如模拟器）可以去 [[此处](https://maa.plus/docs/1.3-%E6%A8%A1%E6%8B%9F%E5%99%A8%E6%94%AF%E6%8C%81.html)] 了解，此处不做赘言。

## 2.准备工作

### 2-0.我需要什么？

在此步骤中，您需要的一步附有无线调试的手机*（笔者使用的手机系统是ColorOSv11）*，一台能够运行基于`.NET 4.8`应用的电脑。

### 2-1.ADB与连接手机

#### 获取ADB

ADB是谷歌推出的一款专门用于连接手机进行调试的开发者工具，在此处充当MAA与手机通信的桥。

**可以点击 [[此处](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)] 下载**

下载后解压备用

#### 打开无线调试

在打开这个之前，你得先打开手机的开发者模式，一般为多次点击系统版本号，这因手机而异。

找到系统的开发者选项，找到调试一栏，打开无线调试。

如果找的到`禁止权限监控`，建议也打开，否则MAA可能无法操作。

#### 配对设备并连接

**如果要使用无线连接必须连接到同一网络下，或者你可以去使用USB调试来连接，教程自寻**

无线调试可点击进入，里面有`使用配对码配对设备`，点击此选项，会出现一个弹窗，记录下配对地址端口与配对码。

假设我的地址端口和配对码如下

| 地址端口 | 127.0.0.1:40333 |
| -------- | --------------- |
| 配对码   | 123456          |

在ADB解压后的文件夹打开终端输入

```shell
.\adb.exe pair 127.0.0.1:40333 #记得改成你自己的地址端口
#正常会出现 Enter pairing code: 直接输入你的配对码回车即可
```

配对成功后即可开始连接，在`使用配对码配对设备`上方，`设备名称`下方有一个用于连接的地址端口（并非上文的地址端口）

假设我的地址端口为`127.0.0.1:42222`

在终端输入

```shell
.\adb.exe connect 127.0.0.1:42222
#正常会出现connected to 127.0.0.1:42222
.\adb.exe devices #确认是否连接成功
#List of devices attached
#127.0.0.1:42222    device
#adb-xxxxx-xxxxx._adb-tls-connect._tcp.      device 不用理他，这是另一种连接方式
```

如果你这一步没什么问题，恭喜你已经成功一半了！

### 2-2.手机分辨率

MAA只能够通过16:9的分辨率工作，否则会出现无法连接的情况，下面给出2种方法来修改手机分辨率。

建议的分辨率如下

| 分辨率        | 1920x1080 |
| ------------- | --------- |
| DPI（非强制） | 480       |

[MAA官方文档](https://maa.plus/docs/1.3-%E6%A8%A1%E6%8B%9F%E5%99%A8%E6%94%AF%E6%8C%81.html#⚙️-手机、平板等非-16-9-分辨率设备)

#### SecondScreen（推荐）

APK文件可以在 [[此处]](https://github.com/farmerbb/SecondScreen/releases/latest) 获取，用法自行探索，不会可以上B站搜`SecondScreen`。

#### 手动修改

```shell
.\adb.exe -s 127.0.0.1:42222 shell #进入设备终端
wm size                               #查看当前设备的分辨率
wm size 1920x1080                      #调整分辨率
```

### 2-3.下载MAA

MAA可以在 [[此处]](https://github.com/MaaAssistantArknights/MaaAssistantArknights/releases/latest) 获取

下载后解压备用，**下载过慢查看其他问题**

## 3.配置MAA

建议使用管理员权限打开`MAA.exe`

### 3-0.选择客户端类型

点击 设置->游戏设置 ，选择你的客户端（官服/B服/...）

### 3-1.配置MAA的ADB连接

点击 设置->连接设置 ，关闭自动检测连接

- ADB绝对路径选择你的`adb.exe`的位置
- 连接地址即为上文**你自己** `.\adb.exe connect`的地址
- 连接配置因人而异，你可以用默认的通用模式
- 触控模式默认的`minitouch`如果手机没有`ROOT`，可能会出现连接成功没有反应，可以换用`MaaTouch`，*别TM用兼容模式*，还是不好使建议点击`强制替换ADB`，没事替换也没啥问题

### 3-2.Link Start!

如果上面的步骤你没啥问题，到这也就结束了，恭喜你完成了配置！

## 4.其他问题

### Github下载过慢

1. 请使用 浏览器 / IDM / FDM / Aria 等正规下载器下载文件，**不要用某雷！**
2. 请打开下载地址中您所需要版本的链接（非镜像站）
3. 找到您所需要下载的文件链接
4. 右键该链接，选择 `复制链接地址`
5. 将链接地址粘贴到浏览器地址栏
6. 将链接地址中的 `github.com` 替换为 `download.fastgit.org`
7. 回车以开始下载

也可以使用`ghproxy.com`（自己点进去看看）