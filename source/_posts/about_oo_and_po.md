---
title: 浅谈面向对象与面向过程
date: 2023-9-17 20:10:00
tags: ["OOP","Rust","Python","C"]
categories: Development & Progarmming
index_img: https://pixiv.nl/111639285-2.jpg
banner_img: https://pixiv.nl/111639285-2.jpg
---

# 浅谈面向对象与面向过程

本人阅历有限，本篇博客如有错误请不吝指出，也欢迎在下方发布你的看法。

## 面向对象（OO） 

### 对象是什么

对象是什么这个问题曾经困惑了我许久，Rust的`struct`和Python的`class`都能够实现一个对象，有人说对象是一个属性和方法集的融合体，也有人说面向对象三大基本特征在于封装，继承，多态，多态和继承都是对于子类和父类关系来说，Rust里没有很好的方法来实现这2个特性，在现代编程中组合优于继承，所以我认为对象最基本的特征还是在于是否可实例化和封装。

#### 封装

例如定义一个生物的类

```rust
struct Living {
    name: String, // 私有属性，不是pub name，用于封装name
}

impl Living {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
        }
    }

    pub fn get_name(&self) -> String {
        return self.name.clone();
    }

    pub fn set_name(&mut self, name: &str) {
        self.name = name.to_string();
    }
}
```

```python
class Living:
    __name:str # 会把这个变量转化为 _Living__name，无法通过__name访问，实现封装
    
    def __init__(self,name:str) -> None:
        self.__name = name
        
    def get_name(self) -> str:
        return self.__name
    
    def set_name(self,name:str) -> str:
        self.__name = name
```

在上述2段代码中，我们都对`name`做了私有化处理，并且定义了2个方法`get_name`和`set_name`，这是很经典的封装，这两个方法叫做`getter`和`setter`，但很多情况下，我们也无需强制自己把所有成员属性私有化并且加上`getter`和`setter`，这是很死的做法。

#### 实例化

实例化就是把一类东西转化为一种东西（这个东西是前面的东西的一个例子，例如`human`是`Living`的一个例子），后者相比前者往往范围更小更精确，还是刚才那个`Living`，让我们实例化一种名为`human`的生物，在很多语言中`new`是作为实例化的关键字，Python的`class`有2个魔法方法，分别是`__init__`和`__new__`，通过字面意思理解，前者是初始化，后者是实例化，C++和Java都有构造函数且都是在`new`时被调用（不考虑C++的其他实例化方法）。

```rust
fn main(){
    let human = Living::new("human"); // 人是有名字的生物的一种实例
    human.set_name("human_i");
    print!("{}",human.get_name())
}
```

```python
human = Living("human")
human.set_name("human_i")
print(human.get_name())
```

上面2段运行结果都是输出`human_i`，我们可以看得出来`Living`的实例有能力为你保存一个`name`的属性，并且通过内置方法来控制。

## 面向过程

我接触的面向过程的语言不多，目前只有C，虽然说可以通过其他语言的多范式编程来实现面向过程，那未免有点不地道。

### 过程

有过程就必然有结果，下方是一个求字符串长度的例子

```C
#include <stdio.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    char x[] = "string";
    printf("%i\n", (int) strlen(x));

    return 0;
}
```

因为我们对`x`使用了`strlen`，`strlen`是一个求解过程，所以得到了`6`这个结果，这看起来远没有面向对象复杂。



## 面向对象的语言与面向过程的语言对比

还是求字符串长度的例子，Python是一门可以进行面向对象的语言，`str`是一类，`str()`/`"string"`都是`str`的实例，如果我们用面向对象的方法来求字符串长度那就是`"string".__len__()`，如果面向过程，那就是`len("string")`，在C里我们用的是后者这种写法，其中的不同，还是很明显的。