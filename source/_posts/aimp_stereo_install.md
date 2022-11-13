---
title: 记一次AIMP的DSP Stereo Tool插件安装
date: 2022-11-06 8:00:00
tags: ["Music","AIMP","DSP"]
categories: Share & Misc
index_img: https://pixiv.re/93025943.jpg
banner_img: https://pixiv.re/93025943.jpg

---

## 前言

前不久（大概），发现了AIMP居然可以使用插件，于是想着往这软件套个DSP，大概是因为假的音乐才好听（雾

<p class="note warning">没有图，建议忍着点</p>

## 安装 dsp_stereo_tool

### 下载

先火树前往官网( https://www.stereotool.com/download )，发现左边上面有个Winamp/DSP plug-in version

下载后拿到了一个Installer了，然后就可以进入第二步了

### 安装

双击后安装程序后，选择`Let me pick a Plugins directory`，点击`NEXT`，然后找到你的AIMP插件文件夹（例如`C:\Program Files (x86)\AIMP\Plugins`），新建一个`dsp_stereo_tool`文件夹，最后选中新建的那个文件夹点击Install，打开AIMP后你就能发现安装成功了

### 注册

你以为安装成功了吗，其实还不算完...如果现在结束的话虽然可以用，但是有时候会蹦出来烦人的滴滴声，对此可以用一些小手段"结束调研"完成注册，在网上冲了会浪，找到了一个Stereo Tool Keygen

运行这个exe，然后点击Patch(改了邮箱建议点一下Generate)，在右下角把文件类型切换为`dsp_stereo_tool.dll`，然后选择你刚才新建的插件目录里的相应文件，等待出现Patch Successfully的弹窗，然后复制Serial的值，打开AIMP，在相应位置输入这串东西，点击下面的Confirm就可以了

### 相关附件

#### 如果有解压密码就是h2sxxa

https://drive.h2sxxa.eu.org/zh-CN/Tools/%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE/AIMP%E6%89%A9%E5%B1%95/