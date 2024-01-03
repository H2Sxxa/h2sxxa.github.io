---
title: 谈谈代码美学
date: 2023-9-17 20:10:00
tags: ["Code Aesthetic","Rust","Python","C"]
categories: Development & Progarmming
index_img: https://pixiv.re/96078807.jpg
banner_img: https://pixiv.re/96078807.jpg
---

# 谈谈代码美学

本篇文章仅仅阐述个人观点，如果有想法欢迎提出讨论

## 什么是代码美学

对于一段代码来说，这段代码可读性高，干净简洁，那么这段代码就是具有美感的，既然有美，那必然就有看上去不太漂亮的代码，下面是一个例子

```rust
/// 获取最小值的下标
fn func(i_vec: Vec<i32>) -> usize {
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

|名称|缩写|
|---|---|
|answer|ans|
|temporary|tmp|
|database|db|
|function|func|
|pointer|ptr|

还是那段二元一次方程，使用缩写后

```rust
let arg: i32 = ...
let ans = 3 * arg.pow(2) + 2 * arg + 1;
```

### 类型系统

对于一些类型系统很强大的静态语言，我们可以使用一部分的类型来减少变量名称的复杂程度

TODO

此时再来重写一下之前那段代码 

```rust
fn findMinIndex(vec: Vec<i32>) -> usize {
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