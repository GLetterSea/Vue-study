<template>
  <div>
    <ul v-for="item in cmovies" :key="item">
      <li>{{ item }}</li>
    </ul>
    <h2 class="test-style">{{ cmessage }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Child',
  // props: ['cmovies', 'cmessage'],
  props: {
    // 1. 数据类型限制
    // cmessage: Number,
    // cmovies: Array,

    // 2. 提供默认值
    cmessage: {
      type: String,
      default: 'Child default message'
    },
    cmovies: {
      type: Array,
      // default: []   vue 2.5.3 以后这种设置默认值的方式就无效了
      default() {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
}
</script>

<style>
.test-style {
  color: brown;
}
.parent-style {
  text-shadow: #000 5px 5px 3px;
}
</style>
