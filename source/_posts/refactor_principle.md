---
title: 重构原则
date: 2026-1-20 19:49:00
tags: ["Code Aesthetic","Rust", "Refactor", "Programming"]
categories: Development & Progarmming
index_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/139123166.jpg&w=800&h=800
banner_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/139123166.jpg&w=800&h=800
---

# 重构原则

> 如果你写过代码，你会知道，越简单的东西往往越可靠，能够复用的代码总是优于重复的代码，可维护的代码总是简单、易读、能够复用的。

## 为什么要做重构

重构（Refactor）就是为了帮助我们写出更好的代码而存在的，新的功能套进旧的架构总是不那么适配，所以我们常常写更多的if、更多的else、更多的特判从而让我们的代码能够跑起来实现我们的功能。

随着时间的推移，这些代码会变得越来越臃肿，越来越难以维护，越来越难以阅读，研发新的功能需要大量的工作量，最终导致我们不得不放弃这个项目或者继续无限量地增加代码量，让后面的工作更加难以继续。这就是大家常说的“技术债务”，而重构就是为了偿还这些技术债务而存在的。

但是我们不想放弃这个项目，因为它还有用，我们想要让它变得更好、更可靠、更易于维护，所以我们就要进行重构。

我想说：重构是必须的，正如没有人能够一开始就能设计出完美的架构、完美的代码。

## 怎么做重构

重构无非就是让代码变得简单，删除冗余的代码，多处相似的设计抽象成一个通用的设计，让代码更易读、更易维护、更易复用。

所以要做重构无非就是，删代码、抽象、简化。

我来为你展示一个例子


```rust
// 重构前的代码
struct User {
    name: String,
    age: u8,
    email: String,
    is_admin: bool,
    permissions: Vec<String>,
}

struct BackendUser {
    name: String,
    age: u8,
    email: String,
}

struct BackendAdmin {
    name: String,
    age: u8,
    email: String,
    permissions: Vec<String>,
}


fn get_user() -> User {
    let mut user = User::default();

    let backend_user = get_user_from_backend();
    if backend_user.is_admin {
        let backend_admin = get_admin_from_backend();
        user.name = backend_admin.name;
        user.age = backend_admin.age;
        user.email = backend_admin.email;
        user.is_admin = true;
        user.permissions = backend_admin.permissions;
    } else {
        user.name = backend_user.name;
        user.age = backend_user.age;
        user.email = backend_user.email;
        user.is_admin = false;
    }

    user
}

// 重构后的代码
#[serde(untagged)]
enum User {
    Admin(BackendAdmin),
    Regular(BackendUser),
}


fn get_user() -> User {
    get_user_from_backend()
}
```

当然这段代码是跑不通的，因为 rust 语法不允许这样的情况出现，我们假定`get_user_from_backend()`函数会根据用户类型返回不同的结构体实例。

重构前，我们需要处理两种用户类型，代码冗长且难以维护，后面获取到新的用户类型还需要继续添加代码，同时在别的地方调用这个函数也要做相应的判断处理。

重构后，我们使用枚举类型来表示不同的用户类型，简化了代码逻辑，提升了代码的可读性和可维护性，后续添加新的用户类型，不需要再继续添加字段，只需要添加一个新的枚举类型。

这就是成功的重构。

## 结语

重构是一个持续的过程，重构的工作量总是比功能更新大很多，如果现在不重构，后面的工作量会更大。

我想应该把重构作为日常开发的一部分，持续地进行重构，而不是等到代码变得难以维护时才去重构，这样才能让我们的代码保持良好的状态，提升我们的开发效率和代码质量。