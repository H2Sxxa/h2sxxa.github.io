---
title: 通过方法链（链式调用）简单来在面向对象中使用函数式编程
date: 2024-5-8 20:58:00
tags: ["Code Aesthetic","Python","OOP","FP"]
categories: Development & Progarmming
index_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/105589501.jpg&w=800&h=800
banner_img: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/105589501.jpg&w=800&h=800
---

# 方法链

不着急来看什么是方法链，思考一下，如果让你使用Python设计一个`Person`类，需要带有名字与年龄，你会如何去设计？

如果你写的漂亮点就是这样。

```python
class Person:
    age = 17
    name = "Yakumo"
```

人的年龄是逐年增长的，如果你想要修改你`Person`实例的年龄，一般会怎么做呢？如果你懒一点直接`person.age += 1`，勤快的就再写个`set_age`方法，调用`person.set_age(17)`，如果又要修改名字呢？是重复以上的 `person.name = ...`吗，那未免有些啰嗦。

此时试想一下如果你在`set_age`返回`self`会怎么样？

```python
from typing import Self

class Person:
    age = 17
    name = "Yakumo"
    def set_name(self, name: str) -> Self:...
    def set_age(self, age: int) -> Self:
        self.age = age
        return self
```

通过返回`self`你就可以继续调用`set_name`调用`set_age`...还可以写出下面这样的代码

```python
person = Person().set_name("Reimu").set_age(16)
```

像这样子调用一个方法之后返回自身实例继续调用自身方法就是方法链，这样的调用方法也就是链式调用！

# 不可变性

在方法链中返回一个新的实例而不是实例本身，这也就是不可变性，一旦值确定后就不对其更改。

大多数情况下你需要为你的类实现一下复制方法，请看代码。

```python
from typing import Self


class Person:
    age = 17
    name = "Yakumo"

    def set_name(self, name: str) -> Self:
        return Person.copy(self.age, name)

    def set_age(self, age: int) -> Self:
        return Person.copy(age, self.name)

    @staticmethod
    def copy(age: int, name: str) -> "Person":
        return Person().set_age(age).set_name(name)
```

间接来看，此时你的年龄与名称都是不可变的，并非修改实例而是创建新的实例，旧的实例通过某些机制回收释放，这也就是函数式的不可变性，对于Python这种写法可能没有多大的意义，但对于Dart来说可以为你的类打上`const`从而进行优化。