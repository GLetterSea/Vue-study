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
        childCpn: child,
    }
})
const child = Vue.extend({
    template: `<h3>子组件</h3>`
})
const app = new Vue({
    el: '#app',
    components: {
        parentCpn: parent,
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
        childCpn: child,
    }
})
```

所以在 `app` 中,  它并不认识 `<child-cpn>` ,  这就是组件的编译范围的原理.  在 Vue 的底层实现中,  其实会将组件编译成一个渲染函数,  这个以后再了解

另外,  在这个例子中可以知道,  Vue 实例也可以说是一个实例,  成为**根实例**,  最开始编译的组件就是它