---
title: 从原子组件与状态编排来看组件化
pubDate: 2026-03-08
tags: ["Web", "Programming", "Frontend", "React", "ShadcnUI", "Functional Programming", "Software Engineering"]
categories: Development & Programming
heroImage: img/pixiv/141961402.png
---

## 前言

最近浅读了一下 [Atomic Design](https://atomicdesign.bradfrost.com/)，之前关于组件化如何编写如何进行的问题，也感到豁然开朗了。实际上一个网站就是由许多页面构成，页面是由许多大的有状态或无状态组件构成的，或者我们可以称其为对有状态或无状态组件的编排，有状态组件又是能够从许多不可再分的无状态的组件得来。

这篇文章就从最小不可分的单位，无状态组件开始探讨应该如何做组件化，或者你可能更喜欢叫它原子组件。

## 何为原子组件

探讨这个问题之前，我们先定义一下原子组件的两个特征：不可变性和不可分性。

### 不可变性

不可变性很难进行定义，如果从组件本身来思考，没有办法保证调用方的输入，我思考了很久，最终我认为从业务状态、视觉状态的角度来看，也许是最好的解释方法。

一个原子组件应该从业务状态中解耦出来，原子组件不应该关心业务状态的变化，它只关心视觉状态的变化。也就是说，原子组件应该是无状态的组件。我认为这里应该引入 MVVM 架构来进行解释，原子组件不该触碰 ViewModel，从 props 传入的值应该仅限于领域模型与基础类型。

简单介绍一下 MVVM，其中 Model 是领域模型，大可认为是你用 OpenAPI Generator 生成的一堆对象类型， View 通常可以是页面，ViewModel 总是使用 Zustand / Jotai / Redux / ... 这些东西来表示。

引入一个有趣的例子，灯和红绿灯。灯是一个非常简单的组件，你只需要传入 Red / Green / Yellow 这样的东西，灯就可以渲染出不同的颜色，并且你给灯加个淡入淡出的动画也完全没问题。红绿灯的话，就是一个经典的业务组件而不是原子组件，它的状态是复杂的，你要维护当前的灯，还要维护倒计时，或者我们说这个组件要维护一个"可变的红绿灯状态"。

总的来说，原子组件并不是真的不可变，实际上，它总是偷偷维护一些无关紧要的状态，总之这些状态是业务无关的，如果没有这些状态，那它当然是不可变的，所以我说原子组件是不可变的组件。

### 不可分性

不可分是建立在已有的设计系统上的，你可能会喜欢使用 `shadcn/ui` 这样的组件或者是一堆带着相同样式的 html 标签组件来编写你的组件，这些组件我称之为全局原子组件，因为无论是什么地方都可以自由地用到这些组件。像对待已有的(`built-in`)函数一样来对待和使用这些组件，这样做，你的视觉上才能保证统一。

那么既然有全局原子组件，我们就可以引出另一个概念，也就是局部原子组件。

在 MVVM 架构中，View 由许多局部原子组件组成，比如在一个通讯录的联系人页面(`ContactsPage`)里，`UserTile` 总是一个局部原子组件，因为我们的设计系统中不会总是定义一个 `UserTile` 组件，而是会通过多个全局原子组件合成，这个组件大多数时候是 `private` 的，它虽然不属于全局设计系统，但在当前页面中承担了与全局原子组件相同的职责，因此可以视为一个局部原子组件。

下面是一个例子来帮助你理解这个问题。

```tsx
// Not Atomic
function ContactsPage() {
  // Business State  
  const { users, setUsers } = useContactsStore();

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserTile key={user.id} user={user} onClick={...} />
      ))}
    </div>
  );
}

// Atomic
function UserTile({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <div className="flex items-center space-x-4">
      {/* Global Atomic Component */}   
      <Avatar src={user.avatar} alt={user.name} />
      <div>
        <p className="text-sm font-medium text-foreground">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
```

如果你想说既然都说了局部原子组件是由多个全局原子组件合成，那么这不是可分的吗，难道不是和不可分性相矛盾吗？

是的，你说得对，既然把一个组件作为局部原子组件从页面里拆出来有助于维护，并且再把这个组件拆下去会不利于维护，为什么不把他作为一个原子组件呢。总而言之，不可分性只是工程意义上来说的，再次拆分下去不利于维护，显得非常碎，才会认为它是不可分的。

## 状态编排

好了，我认为我已经定义好了原子组件，现在我们提高我们的视角，来看看一个页面是怎么构成的吧。

我们可以根据页面构成来把一个页面分为数个区域，每个区域都是由原子组件或者是另一个业务组件(非原子组件)组成的。每个区域都有自己的状态，至于要怎么维护这些状态呢？我认为主要有两种方式，一种是通过 props 传递，另一种是通过依赖注入。

上文提到的 Zustand / Jotai / Redux / ... 能够实现依赖注入，依赖注入是一种很优雅的设计模式，状态的创建和使用以一种最简单的方法进行着，状态的创建和使用是分离的，状态的创建者不需要知道状态的使用者是谁，状态的使用者也不需要知道状态是如何创建的。因此，我们不用在上下文和组件树里到处乱飞我们的状态变量，层层传递 props，该拿的时候拿就行了。

一个简单的示例，如果你不知道什么是依赖注入(DI)

```tsx
// Not DI
function Foo({ foo, bar, foobar }:{ foo: FooType, bar: BarType, foobar: FooBarType }) {
  return (
    <div>
      <FooComponent foo={foo} />
      <BarComponent bar={bar} />
      <FooBarComponent foobar={foobar} />
    </div>
  );
}


// DI
function Foo() {
  const foo = useFoo();
  const bar = useBar();
  const foobar = useFooBar();

  return (
    <div>
      <FooComponent foo={foo} />
      <BarComponent bar={bar} />
      <FooBarComponent foobar={foobar} />
    </div>
  );
}
```

大多数时候，当一个组件的参数超过3个，这个组件就开始变得地狱了(Prop Drilling)，再加上代码如果很长，你可能要先去看看调用点，再回来看组件的实现，无疑是非常痛苦的。依赖注入很好地解决了这个问题。

~感谢DI帮我摆脱参数地狱。~

状态编排没有太多的内容，一个组件只要能够通过合适的方法，无论是 props 传递还是依赖注入，那就是不错的状态编排。

