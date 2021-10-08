<template>
  <div>
    <button
      v-for="{ id, value } in musicTypes"
      :key="id"
      @click="btnClick(value)"
    >{{ value }}</button>
  </div>
</template>

<script>
export default {
  el: 'child',
  props: {
    musicTypes: Array,
  },
  data() {
    return {

    }
  },
  methods: {
    btnClick(value) {
      console.log(value)
      this.$emit('selectType', value)
    }
  }
}
</script>