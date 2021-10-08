<template>
  <div>
    <child :musicTypes="musicTypes" @selectType="getSelectType" />
  </div>
</template>

<script>
import child from './Child'
export default {
  name: 'Parent',
  data() {
    return {
      musicTypes: [
        { id: 'aaa', value: '华语' },
        { id: 'bbb', value: '古风' },
        { id: 'ccc', value: '深夜' },
        { id: 'ddd', value: '治愈' },
      ]
    }
  },
  components: {
    child,
  },
  methods: {
    getSelectType(value) {
      // 监听事件时, 如果处理函数定义有函数而调用时省略了括号, 默认传递原生时间 $event ;
      // 自定义事件中 $emit(name, event) 传递的数据就是用 $event 获取. 所以这里的 value 其实就是自定义事件传递来的数据
      alert(value)
    }
  }
}
</script>
<style>

</style>
