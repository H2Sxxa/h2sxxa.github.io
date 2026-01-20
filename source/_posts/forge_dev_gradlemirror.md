---
title: Forge镜像补全计划（教程向）
date: 2023-7-16 12:00:00
tags: ["Forge","Groovy","Gradle"]
categories: Development & Progarmming
index_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/99637717.jpg&w=800&h=800
banner_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/99637717.jpg&w=800&h=800
---

# 前言

这个教程旨在教你使构建环境完全在镜像下运行，摆脱对代理的依赖。

# 更换Gradle下载地址

Gradle本体的下载地址位于`项目文件夹\gradle\wrapper\gradle-wrapper.properties`中。

打开`gradle-wrapper.properties`，你会看到类似以下的文本

```
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.1.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

把`services.gradle.org/distributions`换成`mirrors.cloud.tencent.com/gradle`，也就是这样。

```
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.1.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

注意：示例中的`gradle-8.1.1-bin.zip`取决于你自己`gradle-wrapper.properties`，没有把握请勿随便更改！

# ROSA

下载地址 https://github.com/H2Sxxa/Rosa/releases/latest

镜像测试的报告 https://github.com/H2Sxxa/Rosa/blob/bin/forgegradle/class/TEST_REPORT.md

下载后配置好它的镜像修补就行，教程看Rosa首页的图片教程

（PS:觉得好用不妨给项目点个Star）

# 新版 Gradle

要改的地方一共有3个，这3个文件都在项目文件夹下

## gradle.properties（如果没有可以直接新建一个gradle.properties然后添加保存）

将这一段直接加在最下面

```
# mirror
use_mirror = true
# BMCLAPI is unstable sometimes, use lss233's mirror for alternative.
#mirror_maven_url=bmclapi2.bangbang93.com/maven
#mirror_maven_url=crystal.app.lss233.com/repositories/minecraft
mirror_maven_url=download.mcbbs.net/maven
```

## setting.gradle

```groovy
pluginManagement {
    repositories {
        //......原来的东西不要动，把以下内容添加
        if (use_mirror.toBoolean()) {
            removeIf {
                it instanceof MavenArtifactRepository &&
                    (it.url.toString() == "https://repo.maven.apache.org/maven2/")
            }
            maven {
                name 'Ali Mirror Maven'
                url "https://maven.aliyun.com/nexus/content/groups/public"
                allowInsecureProtocol = true
            }
            maven {
                name 'MC Mirror Maven'
                url "https://${mirror_maven_url}"
                allowInsecureProtocol = true
            }
            //more mirror maven add here,in order to search plugins
        }
		//截止到这里，必须要在这几个东西上面，下面这些东西请勿一并添加
        gradlePluginPortal()
        mavenLocal()
        mavenCentral()
    }
}
```

## build.gradle

```groovy
repositories {
    //......原来的东西不要动，把以下内容添加
    if (project.use_mirror.toBoolean()) {
        removeIf {
            it instanceof MavenArtifactRepository &&
                (it.url.toString() == "https://repo.maven.apache.org/maven2/")
        }
        maven {
            name 'Ali Mirror Maven'
            url "https://maven.aliyun.com/nexus/content/groups/public"
            allowInsecureProtocol = true
        }
        maven {
            name 'MC Mirror Maven'
            url "https://${mirror_maven_url}"
            allowInsecureProtocol = true
        }
        //more mirror maven add here,in order to search plugins
    }
    //截止到这里，必须要在这几个东西上面，下面这些东西请勿一并添加
    mavenLocal() // Must be last for caching to work
}
```

# 旧版 Gradle

要改的地方一共有2个，这2个文件都在项目文件夹下

## gradle.properties（如果没有可以直接新建一个gradle.properties然后添加保存）

将这一段直接加在最下面

```
# mirror
use_mirror = true
# BMCLAPI is unstable sometimes, use lss233's mirror for alternative.
#mirror_maven_url=bmclapi2.bangbang93.com/maven
#mirror_maven_url=crystal.app.lss233.com/repositories/minecraft
mirror_maven_url=download.mcbbs.net/maven
```

## build.gradle

```groovy
buildscript {
    //只需要改repositories里的内容
    repositories {
        if (use_mirror == "true") {
        removeIf {
            it instanceof MavenArtifactRepository &&
                (it.url.toString() == "https://repo.maven.apache.org/maven2/")
        }
            maven { url "https://maven.aliyun.com/nexus/content/groups/public" }
            maven { url "https://${mirror_maven_url}" }
        } else {
            mavenCentral()
            maven { url "https://maven.minecraftforge.net" }
        }
    }
	//...其他不用管
}
//...
repositories { // 在这个大括号内添加
    if (use_mirror == "true") {
    removeIf {
        it instanceof MavenArtifactRepository &&
            (it.url.toString() == "https://repo.maven.apache.org/maven2/")
    }
        maven { url "https://maven.aliyun.com/nexus/content/groups/public" }
        maven { url "https://${mirror_maven_url}" }
    }
    //...其他不用管
}
//...
```

