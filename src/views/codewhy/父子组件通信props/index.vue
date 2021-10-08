<template>
  <div>
    <h2 class="test-style parent-style">父组件样式展示</h2>
    <!-- 1. 最好加上v-bind, 否则属性值当作字符串数据传入 -->
    <!-- <child cmessage="message" cmovies="movies"></child> -->
    <!-- <child :cmessage="message" :cmovies="movies"></child> -->

    <!-- 2. 不绑定cmessage, 使用子组件默认值 -->
    <!-- <child :cmovies="movies"></child> -->
    <!-- 2.1 使用数组类型的默认值 -->
    <child :cmessage="message"></child>
  </div>
</template>

<script>
import child from './Child'

export default {
  name: 'Parent',
  data() {
    return {
      message: 'Parent message',
      movies: ['千与千寻', '言叶之庭', '你的名字', '天气之子']
    }
  },
  components: {
    child,
  }
}
</script>

<style>
.test-style {
  color: blueviolet;
}
</style>
