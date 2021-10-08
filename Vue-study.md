## 组件化开发

### 父子组件

组件的注册分为全局注册和局部注册,  而父子组件的关系就是一个组件与在该组件中局部注册的组件.

**子组件只有父组件可以识别并编译出模板**,  隔代的爷爷组件或其他祖宗组件不能识别,  这是要注意的一个错误用法



#### 解析子组件的识别编译过程

- 发现(注册)组件,  开始编译组件
- 编译组件模板内容
- 模板内容中发现**自定义标签**
- 在组件内查找是否有注册的子组件
  - 找到注册子组件:  编译子组件
  - 未找到注册子组件:  查找注册全局组件
    - 找到全局组件:  编译全局组件
    - 未找到全局组件:  编译报错,  DOM 树直接显示自定义标签
- 完成组件的模板内容编译 - 已全部转换为原始 HTML 标签
- 编译完成,  显示编译后的模板内容

从这个组件的编译过程可以了解子组件只能被父组件识别的原因,  当一个父组件的模板内容在编译时遇到一个子组件,  会先对该子组件编译完成,  而该子组件编译完成后已经是原始的 HTML 标签了,  所以爷爷组件并不认识这个孙子组件

```html
<div id="app">
    <parent-cpn></parent-cpn>
    <child-cpn></child-cpn>
</div>
```

```js
const parent = Vue.extend({
    template: `
		<div>
			<h2>父组件</h2>
			<child-cpn></child-cpn>
		</div>
		`,
    components: {
        'childCpn': child,
    }
})
const child = Vue.extend({
    template: `<h3>子组件</h3>`
})
const app = new Vue({
    el: '#app',
    components: {
        'parentCpn': parent,
    }
})
```

如上例子中,  当编译 `<parent-cpn>` 的模板时,  遇到 `<child-cpn>` 会先将该组件进行编译,  编译完成后才会继续编译 `<parent-cpn>` ,  此时 `<parent-cpn>` 的模板内容以变为:

```js
const parent = Vue.extend({
    template: `
		<div>
			<h2>父组件</h2>
			<h3>子组件</h3>
		</div>
		`,
    components: {
        'childCpn': child,
    }
})
```

所以在 `app` 中,  它并不认识 `<child-cpn>` ,  这就是组件的编译范围的原理.  在 Vue 的底层实现中,  其实会将组件编译成一个渲染函数,  这个以后再了解

另外,  在这个例子中可以知道,  Vue 实例也可以说是一个实例,  成为**根实例**,  最开始编译的组件就是它



### 注册组件语法糖

Vue 提供的注册组件语法糖就是省略了 `Vue.extend()` 创建组件构造器的步骤,  改为直接使用一个对象

```js
// 1. 全局注册组件语法糖
Vue.component('cpn', {
    template: `
		<div>
			<h2>全局注册组件语法糖</h2>
		</div>
	`
})

// 2. 局部注册组件语法糖
const app = new Vue({
    el: '#app',
    components: {
        'cpnA': {
            template: `
				<div>
					<h2>局部组测组件语法糖</h2>
				</div>
			`
        }
    }
})
```

> tip.  *虽然可以用普通 JavaScript 对象代替 `Vue.extend()` 构建的组件构造器来注册组件,  但在 Vue 的源码中,  还是调用 `Vue.extend()` 来创建组件构造器*



### 组件的模板抽离

写过的都知道,  在组件的 `template` 属性中使用 字符串来编写模板,  不仅格式很乱,  IDE 没有语法提示,  而且复杂的模板内容也会让组件看起来很乱.  为了代码更清晰,  有两种将组件的模板抽离处理出来的写法:

- `<script>` 标签

  ```html
  <script type="text/x-template" id="cpn">
  <div>
  	<h2>script 标签内编写模板内容</h2>
  </div>
  </script>
  <script>
  new Vue({
      el: '#app',
      template: '#cpn'
  })
  </script>
  ```

  使用 `text/x-template` 类型的 `<script>` 标签,  就可以在该 `<script>` 标签里编写组件的模板内容.  而组件联系模板内容的方式和挂载 Vue 实例的方式类似,  赋予 script 标签一个 `id` ,  然后给组件的 `template` 赋值 id 选择器的字符串

- `<template>` 标签

  ```html
  <template id="cpn">
  <div>
      <h2>template 标签内编写模板内容</h2>
  </div>
  </template>
  <script>
  new Vue({
      el: '#app',
      template: '#cpn'
  })
  </script>
  ```

  `<template>` 标签基本和 `text/x-template` 类型的 `<script>` 一样,  只是从 HTML 的 DOM 结构上看更加合理,  之后使用 Vue-Cli 也是使用 `<template>` 标签,  这个之后再说



### 组件的数据

每个组件都有自己的 `data` ,  我们要牢记一条规则:

> **父级组件的模板里所有内容都是在父级作用域中编译的,  子模板里的所有内容都是在子作用域中编译的**

父级的 `data` 只能在父组件的模板中使用,  子组件无法直接访问和使用.  所以每个组件都有属于自己的 `data` 



#### 组件的 `data` 定义方式

```js
Vue.component('cpn', {
    data() {
        return {
            message: 'hello components'
        }
    }
})
```

组件的 `data` 定义方式与 Vue 实例有点不同,  组件的 `data` 必须是一个 function 而不是一个普通的 Object ,  而函数的返回值则是一个对象,  这个对象就和 Vue 实例中定义 `data` 的对象一样,  包含了组件的各项数据



**为什么组件的 `data` 必须是函数呢 ?**

JavaScript 中定义的对象,  其变量名本质上保存的都是对象存放的物理地址而非对象本身,

```js
let obj1 = {
    name: 'Kobe'
}
let obj2 = obj1
obj2.name = 'GLetter'    // obj1.name -> 'Gletter'
```

因此,  如上例中,  两个对象其实指向的是同一个对象,  修改其中一个就会导致其他的都发生变化

而组件化开发的一大优点就是可复用,  一个组件可以在不同的地方注册复用,  为了足够高效和节省空间,  Vue 的一个组件中都是重复使用的同一个对象.  因此 `data` 属性如果使用的是对象进行定义,  那么 `data` 保存的本质上是对象的物理地址,  这样的话所有复用的组件使用的也都是同一个 `data` 

这样显然是不符合复用要求的,  所有组件应该有自己的 `data` ,  使用同一个带来的后果可想而知,  必然会造成冲突和错误,  且错误排查的难度极大

那么解决这个问题方法,  就是将 `data` 定义为 function ,  每个复用组件都会调用一次该方法,  从而获得一个返回的新对象(物理地址),  那么每个复用组件就都拥有属于自己的 `data` 了



**演示:  组件中的 `data` 使用对象定义**

因为 Vue 的限定,  组件的 `data` 使用对象定义会抛出异常,  那如果你不相信使用对象定义 `data` 会让所有组件使用同一对象,  非要亲眼看到才行,  那也有办法能模拟给你看:

```html
<div id="app">
    <cpn></cpn>
    <cpn></cpn>
    <cpn></cpn>
</div>
<template id="cpn">
    <div>
    	<h2>当前计数: {{counter}}</h2>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
    </div>
</template>
```

```js
const obj = {
    counter: 0
}
Vue.component('cpn', {
    template: '#cpn',
    data() {
        return obj
    },
    methods: {
        increment() {
            this.counter++
        },
        decrement() {
            this.counter--
        }
    }
})
new Vue({
    el: '#app',
})
```

定义一个对象 `obj` ,  `data` 直接返回这个对象,  这和直接在 `data` 中用对象定义的效果一样的.  此时,  我们在页面中点击任意一个按钮,  所有的计数器都会发生变化



### 父子组件通信

Vue 在父子组件通信中分别提供了一种父传子和子传父的常规通信方法,  这也是比较稳定,  推荐使用的方法,  这基本满足大部分父子间通信的需求,  如果没有特殊的需求,  大多时候尽量使用这种常规的方法.  下面先分别介绍两种常规方法:

#### 父传子:  属性绑定

```html
<div id="app">
    <cpn :message="msg"></cpn>
</div>
<template id="cpn">
	<div>
        <h2>{{message}}</h2>
    </div>
</template>
<script>
const cpn = {
    template: '#cpn',
    props: ['message']
}
new Vue({
    el: '#app',
    data: {
        msg: '父组件数据'
    },
    components: {
        cpn,
    }
})
</script>
```

上面的例子就是最基本的父传子过程,  

父传子主要是通过 `props` 属性,  可以看到这是在子组件内的一个属性,  通过该属性可以接收父组件传递来的数据,  而父组件则是在使用子组件时,  在子组件的自定义标签上绑定( `v-bind` )要传递给子组件的属性,  属性的值就是要传递的数据

> *tip:  父组件使用子组件进行属性绑定时,  最好要加上 `v-bind` ,*
>
> *因为在 Vue 的指令后赋值的属性值,  Vue 会当作 JavaScript 表达式处理,  如果是 `:msg="message"` ,  会将 `message` 当作变量名处理;  而如果是 `msg="message"` ,  则会将 `message` 当作一个字符串直接传给子组件*
>
> ![image-20211006150511696](D:/Workspace/Projects/vue-project/Vue-study.assets/Vue属性绑定传递数据不加v-bind后果.png)



**`props` 的值有两种类型:**

- 字符串数组

  这是比较简单的写法,  数组的元素就是要接收的父组件传递来的属性名字符串

  说明白点,  这些字符串和父组件在子组件的标签上 `v-bind` 的属性名一致,  如上例中的 `message` 属性,  在子组件中这些字符串可以如同 `data` 中的变量名一样只用,  如`this.message`

  而绑定的这些属性名的值就是父组件中的数据,  一般是父组件 `data` 中的变量名

  ```html
  <!-- msg, val是属性绑定的名称, 与自组件props内的元素保持一致; message, value是父组件data中的变量 -->
  <cpn :msg="message" :val="value"></cpn>
  ```

  ```js
  // props数组内的字符串与属性绑定的属性名保持一致
  props: ['msg', 'val']
  ```

  而在子组件的模板中,  `props` 内的每个字符串可以当作一个变量名一样直接调用

- 对象

  除了数组,  `props` 的值还可以是一个对象.  这种对象的写法比数组写法要强大很多:

  - 数据类型验证

    ```js
    props: {
        cMessage: String,   // 字符串类型
        cMovies: Array,   // 数据类型
        cAge: [String, Number]   // 多个可能的类型限制
    }
    ```

    `绑定属性名: 数据类型` 这种写法可以给父组件绑定的属性进行数据类型校验,  如果类型不符合则异常

    ![image-20211006151311420](D:/Workspace/Projects/vue-project/Vue-study.assets/image-20211006151311420.png)

    

    验证支持的数据类型包括:

    - String
    - Number
    - Boolean
    - Array
    - Date
    - Object
    - Function
    - Symbol
    - 自定义类型

    注意一点,  **基础的类型检查,  `null` 和 `undefined` 会通过任何类型验证**

  - 提供默认值

    ```js
    props: {
        cMessage: {
            type: String,    // 数据类型限制
            default: 'default value',    // 默认值
        },
    }
    ```

    给 `porps` 内接收的数据赋值一个对象,  对象中的 `default` 就是提供给该属性的默认值,  当父组件**没有进行绑定属性传值时**,  就显示默认值.  如果绑定了当传递的是 `''` 也会展示空值

    

    对于数组和对象类型的 `props` 数据,  其默认值必须通过一个工厂函数返回:

    ```js
    props: {
        cMovies: {
            type: Array,
            // default: [],   vue 2.5.3以前这种写法是没问题的
            default() {
                return []
            }
        }
    }
    ```

    直接以 `default: []` 的方式设置默认值时,  会提醒"默认值无效,  `Object/Array` 必须使用工厂函数返回默认值",

    ![image-20211006154121186](D:/Workspace/Projects/vue-project/Vue-study.assets/image-20211006154121186.png)

  - 必填项

    ```js
    props: {
        cmessage: {
            type: String,
            required: true,
        }
    }
    ```

    设置了 `required` 属性,  则父组件使用子组件时必须绑定该属性进行传值,  否则抛出异常

  - 自定义验证

    ```js
    props: {
        cmessage: {
            validator(value) {
                return ['success', 'warning', 'danger'].indexOf(value) !== -1
            }
        }
    }
    ```

    `validator()` 函数自定义验证规则,  如果返回 `true` ,  则验证通过;  返回 `false` 则验证不通过



##### props 命名

`props` 内的数据名是要绑定在子组件的标签上使用的,  而 HTML 的标签不区分大小写,  因此如果 `props` 内的变量使用驼峰命名法,  在子组件上及进行绑定时不能直接绑定驼峰命名的属性

Vue 对驼峰命名的属性名进行了转换,  在属性绑定时需使用**短横线命名**式来绑定

```html
<!-- 这种绑定属性的方式, 浏览器引擎会自动转为小写cmessage, 就无法识别自组件中的props -->
<cpn :cMessage="message"></cpn>
<!-- 使用短横线来表示驼峰法, Vue会自动转换 -->
<cpn :c-message="message"></cpn>
```

```js
// 子组件
{
    props: {
        // 驼峰法命名
        cMessage: {
            type: String
        }
    }
}
```

> *tip.  在脚手架 Vue-Cli 中,  标签内绑定属性名时是可以直接使用驼峰命名的,  这里要转换为短横线式是在直接引入 Vue.js 文件的情况下*
>
> *这种现象的原因应该是 Vue-Cli 中的组件在编译时会先完整的进行编译,  转化为一个 `render` 函数,  而直接引入 Vue.js 文件的方式不会转化而是使用一些原生的 js 编译方法进行编译* 



#### 子传父:  自定义事件

子组件需要传递数据给父组件时,  以 "触发事件,  父组件监听时间" 的形式更合理.  如子组件中的点击事件,  点击后有父组件进行监听以获取子组件的变化

因此,  在子组件需要传递数据给父组件时,  可以通过 `$emit` 触发自定义事件: 

```html
<div>
    <cpn @cpn-click="childEvent"></cpn>
</div>
```

```js
// 子组件
{
    methods: {
        btnClick() {
            // 触发自定义事件 cpnClick
            this.$emit('cpnClick')
        }
    }
}
```

`$emit(eventName, data)` 的参数:

- `eventName` - 第一个参数是自定义事件的名称,  和属性绑定一样,  因为 HTML 标签不识别大小写,  因此在监听事件时需要**将驼峰法名字转为短横线式名字**,  如果在 Vue-Cli 中可以直接使用驼峰法
- `data` - 第二个参数是子组件要传递给父组件的数据,  在子组件标签上监听时处理函数可以省略 `()` ,  而监听事件的处理函数省略 `()` 时默认传递的参数是 `event` ,  因此这个 `data` 的数据也可以由 `$event` 获取

