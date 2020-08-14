<template>
  <div class="hm-nav" @click="handleClick">
    <div class="left">{{name}}</div>
    <div class="center">{{desc}}</div>
    <div class="right">
      <i class="iconfont iconjiantou1"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-nav {
  display: flex;
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  .left {
    font-size: 14px;
    color: #333;
  }
  .center {
    flex: 1;
    text-align: right;
    font-size: 12px;
    color: #666;
  }
  .right {
    padding: 0 5px;
  }
}
</style>
