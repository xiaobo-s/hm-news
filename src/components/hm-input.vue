<template>
  <div class="hm-input">
    <input
      class="inp"
      @input="handleInput"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :class="[status]"
    />
    <span v-show="isShowTips" class="tips">{{ errMsg }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    isShowTips() {
      return this.status === 'error' && this.errMsg
    }
  },
  data() {
    return {
      status: ''
    }
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    rules: {
      type: RegExp
    },
    errMsg: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(e) {
      const value = e.target.value
      this.$emit('input', value)

      if (!this.rules) return

      if (this.rules.test(value)) {
        this.status = 'success'
      } else {
        this.status = 'error'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-input {
  padding-bottom: 20px;
  position: relative;
  .inp {
    height: 40px;
    border-bottom: 2px solid #666;
    background: transparent;
    width: 100%;
    font-size: 20px;
    // 线三种颜色, 默认#666, 错误:红色, 成功:绿色
    &.success {
      border-color: green;
    }
    &.error {
      border-color: red;
    }
  }
  .tips {
    position: absolute;
    left: 0;
    bottom: 0;
    color: red;
  }
}
</style>
