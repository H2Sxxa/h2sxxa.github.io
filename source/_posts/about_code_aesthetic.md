---
title: 谈谈代码美学
date: 2023-9-17 20:10:00
tags: ["Code Aesthetic","Rust","Python","C"]
categories: Development & Progarmming
index_img: https://pixiv.nl/96078807.jpg
banner_img: https://pixiv.nl/96078807.jpg
---

# 谈谈代码美学

本篇文章仅仅阐述个人观点，如果有想法欢迎提出讨论

## 什么是代码美学

最近看了一系列代码美学相关的视频，什么是代码美学，乍一听感觉是用代码画一幅画，雕几个雕塑之类的，其实并不，代码美感来源于良好的编程习惯与一些技巧，本篇文章谈谈我的拙见

对于一段代码来说，这段代码可读性高，干净简洁，便于使用或维护，那么这段代码就是具有美感的，这种代码往往质量较高，下面有一段不太漂亮的代码

```rust
/// 获取最小值的下标
/// 传入一个 i32 的 Vec
fn get_index(i_vec: Vec<i32>) -> usize {
    let mut i: usize = 0;
    let mut j: usize = 0;
    let mut k: i32 = i32::MAX;
    for v in i_vec {
        if v < k {
            k = v;
            j = i;
        }
        i += 1;
    }
    j
}
```

这段代码并不复杂，但解读起来也略有难度，`i`是当前下标，`j`是当前最小值下标，`k`是当前最小值，遍历`i_vec`，如果当前值`v`比`k`小，则替换`k`并把当前下标保存至`j`

仔细想想，首先阻碍我们理解这段代码的是什么？

没错，就是变量的命名方式！

## 代码美学与命名方式

### 避免晦涩

可能各种语言都有不同的命名规范，譬如`Rust`的变量是使用蛇式（`snake_case`），而`Dart`使用的是小驼峰式（`camelCase`）

在遵循一种命名规范下，我们的变量名称应该避开使用单个小写字母，以及避开过度缩写，这样我们的变量名称才不会过于晦涩难懂

你可能会想，平时看到的代码中往往会用 `i`、`j`、`k` 来指代各种的值，这难道是错的吗？这种单个字母的命名来源于数学，早期计算机与数学密切相关，譬如一个二元一次方程 $y=3x^2+2x+1$ ，如果用代码表示

```rust
let x: i32 = ...
let y = 3 * x.pow(2) + 2 * x + 1;
```

数学家们似乎很喜欢使用这种方法命名，这种变量名称的确很简洁很酷，但适合数学家的不一定适合程序员，用不那么数学的方法来改写，那么就是下面这样

```rust
let argument: i32 = ...
let answer = 3 * argument.pow(2) + 2 * argument + 1;
```

可能你会觉得这没什么，确实没什么，在这里仅仅是2行代码，无论是`x`与`argument`还是`y`与`answer`都无所谓，试想如果是一个复杂的公式求解函数，大段的`x`与`y`此时就会略显突兀，与运算符号同样宽的变量看起来就是点阵图，再加上有些人没有使用代码格式化工具的习惯，那么这段代码就是灾难了，把可读性降到极低的方法叫混淆，在拥有同样功能性能的两份代码之中，选择可读性较高的一种并非没有道理

### 约定俗成

什么叫约定俗成，那便是有大部分人认可的一些变量命名方式

如果你接触过`Python`，那你应该会知道诸如`args`、`kwargs`的变量

```python
def func(*args,**kwargs):
    pass
```
`args`是`argument`的缩写，`kwargs`是`keyword arguments`的缩写，这些东西都是人们所认可的，不必说也能够理解

简单列举几个缩写（仅供参考）

| 名称      | 缩写 |
| --------- | ---- |
| answer    | ans  |
| temporary | tmp  |
| database  | db   |
| function  | func |
| pointer   | ptr  |

还是那段二元一次方程，使用缩写后

```rust
let arg: i32 = ...
let ans = 3 * arg.pow(2) + 2 * arg + 1;
```

### 保持简洁

在早期计算机编程中，在一个庞大的项目中确定一个变量的类型是十分麻烦的，匈牙利命名法就是为了解决这个类型诞生的，简单来说用法就是 `类型缩写+大写开头变量名称` ，下面是几个例子

```C
int iAge;// int
char szName[];// char
```

```C#
interface IAnimal {} // interface
```

笔者曾经就对 `Java` 中的接口要不要使用 `I` 开头而纠结过，究其原因其实就是为什么要加，加了有什么好处，像 `C#` 的官方文档之中，命名接口也使用了匈牙利命名法，那么遵守官方文档的规范或许是一个好的选择，但如果没有官方文档呢？

现代编程工具查看一个变量的类型是非常便利的，那让变量前面加个类型缩写也就没那么重要了，你已经事先知道`Animal`是一个接口了，那究竟是什么驱使你加上那几个字母，就像StackOverflow上的一句话

> The times of the Hungarian notation have passed

对于现代编程，一个更好更简洁的命名法能够让你的代码看上去更漂亮

但也不是说不要用匈牙利命名法，就像`C#`中的接口命名一样，如果事先有一个规范，那么去遵守，大胆去用就对了，匈牙利命名法还适用于涉及WinAPI的C/C++编程

## 代码美学与类型注释

现在有很多的编程语言拥有强大的类型系统，这些类型系统应用得当可以帮助我们更好的调用方法，这个例子很容易说明

在`Python`中，下面2个函数的不同之处是有意义的

```python
class Animal:
    def get_name(self) -> str:
        return self.name


def get_animal_name(animal):
    return animal.get_name()


def get_animal_name(animal: Animal) -> str:
    return animal.get_name()
```

由于`Python`是一门动态类型的语言，当你调用上面这个函数时，由于没有给出确切的类型，他不会告诉你返回什么，输入什么

![image-20240104203459309](https://raw.githubusercontent.com/H2Sxxa/Blog-ImageGallery/main/picture/image-20240104203459309.png)

而下面这个函数给出了确切的类型注解，因此你可以放心的传入一个`Animal`并使用返回的`str`类型

![image-20240104203552056](https://raw.githubusercontent.com/H2Sxxa/Blog-ImageGallery/main/picture/image-20240104203552056.png)

因此，我认为，类型系统其实也能算作注释或文档的一部分，如果你有一个拥有明确目的的函数名和确切的类型，删除一部分的多余的注释是完全没有问题的

此时再来重写一下之前那段寻找最小值的代码 

```rust
fn find_min_index(vec: Vec<i32>) -> usize {
    let mut current_index: usize = 0;
    let mut ans_index: usize = 0;
    let mut min: i32 = i32::MAX;
    for v in vec {
        if v < min {
            min = v;
            ans_index = current_index;
        }
        current_index += 1;
    }
    ans_index
}
```

## 代码美学与编程范式

### 函数式编程与代码扁平化

对于很多人来说，函数式编程看起来遥远实则相近，大部分的语言如今都或多或少支持一部分的函数式编程，你可能在用，但你不知道这就是函数式编程，像`Python`里的`lambda`、`map`、`filter`，`Java`的`java.util.function`下的`Consumer`、`Supplier`、`Predicate`、`Function`都是属于函数式编程的范畴之内，更不必提`Haskell`、`ML`、`Scala`这些以函数式而出名的语言，如果你对函数式编程感兴趣可以自行去了解，这不属于本篇文章的范畴，函数式编程有什么好处？暂且不提开发效率，使用函数式编程会大大减少代码的嵌套，也就是**代码扁平化**

再次来重写一下上面的这段代码

```rust
fn find_min_index(vec: Vec<i32>) -> usize {
    let mut ans_index: usize = 0;
    let mut min: i32 = i32::MAX;

    vec.into_iter()
        .enumerate()
        .for_each(|(current_index, value)| {
            if value < min {
                min = value;
                ans_index = current_index;
            }
        });

    ans_index
}
```

代码扁平化还有另一种方法那就是提取内层嵌套为一个函数，这种方法并不难理解也不过多阐述

### 面向对象编程与设计模式

设计模式是什么，其实就是一系列代码的最佳实践，至于和面向对象放在一起，那是因为`Java`的设计模式往往是属于比较出名的那个，而`Java`又是典型的面向对象语言

#### 抽象

设计模式往往与抽象有关，因此知道什么是抽象实际上是必要的，什么是抽象？抽象是从几个具体的事物抽离相似的部分，简单地从一段代码实例来说

```python
class Pig:
    def drink(self): ...
    def eat(self): ...
    ...

class Dog:
    def drink(self): ...
    def eat(self): ...
    ...
```

可以看到`Pig`和`Dog`拥有相同的特征，`eat`和`drink`，把共同的特征抽离出来就是`Animal`，这就是一个抽象，此外，我们还可以把`Animal`定义为一个抽象类（Abstract Class）

```python
class Animal(ABC):
    def drink(self): ...
    def eat(self): ...


class Pig(Animal)
class Dog(Animal):...
```



## 参考文献

[^1]: [四种基本的编程命名规范 - 知乎](https://zhuanlan.zhihu.com/p/89909623)
[^2]: [C#官方文档中的接口](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/interface)
[^3]: [Confused about the Interface and Class coding guidelines for TypeScript(StackOverflow)](https://stackoverflow.com/a/41967120/4676238)

