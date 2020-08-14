<template>
  <div class="hm-header">
    <div class="left">
      <slot name="left">
        <i class="iconfont iconjiantou2" @click="$router.go(-1)"></i>
      </slot>
    </div>
    <div class="center">
      <h3>
        <slot>标题</slot>
      </h3>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.hm-header {
  height: 50px;
  line-height: 50px;
  display: flex;
  .left,
  .right {
    width: 50px;
    text-align: center;
    i {
      display: block;
    }
  }
  .center {
    flex: 1;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
  }
}
</style>
