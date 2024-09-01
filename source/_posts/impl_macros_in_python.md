---
title: 如何在 Python 中实现宏展开?
date: 2024-09-01 19:30:00
tags: ["Python","Macros","Black Magic"]
categories: Development & Progarmming
index_img: https://pixiv.nl/122018493.jpg
banner_img: https://pixiv.nl/122018493.jpg
---

# 如何在 Python 中实现宏展开?

Python 的语法以灵活性见长，有时候可能需要动态地对一个模块进行修改，也就是为人熟知的 `Monkey Patch`

普通的修改对于一些静态生成的常量效果有限，例如下面这段代码，尽管可以修改 `generator`，但并不会影响调用这个函数生成的变量的值。

```python
def generator(name): return "static " + name

python = generator("python")
rust = generator("rust")
```

那么有没有一种方法能够解决这个问题而又不直接修改这个文件？这个过程有点类似于许多语言的宏展开机制，因此本篇文章也取名为 `如何在 Python 中实现宏展开?`

## 什么是宏 (Macro)

简单地解释，宏就是在编译前对源代码进行替换。

C 中的宏最容易理解，下面这段代码就是对 `VAL` 进行了替换，不难理解.

```C
#define VAL 123

int main(void){
    printf("%d", VAL);
    return 0;
}

>>> 123
```

## Python 与 模块

Python 的模块是这样引入的

import -> finder/loader -> [compile to py_code] -> write to `__py_cache__`

是否重新编译写入 `py_code` 到缓存拥有校验，校验的标准可能是文件的时间戳或是哈希值

如果校验结果相同，会尝试复用 `__py_cache__`，而 `sys.dont_write_bytecode` 会影响读写 `__py_cache__`

## Python 与 编译

Python 的编译是使用 `builtins.compile` 进行的，我们只需对这个函数进行修改，捕获并修改 `source` 便可达到宏的效果

而 `builtins.compile` 的其他参数可以帮你确定模块，例如 `filename`

```python
import sys
import builtins

sys.dont_write_bytecode = True

origin_compile = builtins.compile

def wrapper(source, *args, **kwargs):
    return origin_compile(source.replace(...), *args, **kwargs)

builtins.compile = wrapper

import ...
```

## Saleyo

Saleyo 提供了一套工具，推荐尝试使用😊

https://pypi.org/project/saleyo/

```python
# targetmodule
def generate(name):
    return name + " hell world"


class StaticMap:
    FIELD = generate("hello")

# mixin
from typing import Any, Union
from saleyo.decorator.compile import CompileToken, CompileBoundary


@CompileToken(lambda info: "targetmodule.py" in str(info.filename))
def mixin_a(token: Union[str, bytes, Any]):
    if not isinstance(token, bytes):
        return
    return token.replace(b"hell world", b"bye")


with CompileBoundary(): # Force to compile
    from targetmodule import StaticMap

print(StaticMap().FIELD)  # hello bye

>>> hello bye
```