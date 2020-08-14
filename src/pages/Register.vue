<template>
  <div class="register">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="ussername">
      <hm-input :rules="userRules" err-msg="以1开头的5-11位的数字" v-model="username" placeholder="账号/手机号"></hm-input>
    </div>
    <div class="nickname">
      <hm-input :rules="nickRules" err-msg="2-6位的中文字符" v-model="nickname" placeholder="昵称"></hm-input>
    </div>
    <div class="password">
      <hm-input :rules="passRules" err-msg="3-11位的字符" v-model="password" placeholder="密码"></hm-input>
    </div>
    <div class="register-btn">
      <hm-button @click="register">注册</hm-button>
    </div>
  </div>
</template>

<script>
import HmInput from 'components/hm-input'
import HmButton from 'components/hm-button'
export default {
  components: {
    HmInput,
    HmButton
  },
  data() {
    return {
      username: '',
      nickname: '',
      password: '',
      userRules: /^1\d{4,10}$/,
      nickRules: /^[\u4e00-\u9fa5]{2,6}$/,
      passRules: /^\w{3,11}$/
    }
  },
  methods: {
    async register() {
      if (!this.userRules.test(this.username)) {
        this.$toast('请输入正确的账号')
        return
      }
      if (!this.nickRules.test(this.nickname)) {
        this.$toast('请输入正确的昵称')
        return
      }
      if (!this.passRules.test(this.password)) {
        this.$toast('请输入正确的密码')
        return
      }
      // 发送请求
      const res = await this.$axios.post('/register', {
        username: this.username,
        nickname: this.nickname,
        password: this.password
      })
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.$router.push({
          name: 'login',
          params: {
            username: this.username,
            password: this.password
          }
        })
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.register {
  padding: 20px;
  .close {
    i {
      font-size: 27px;
    }
  }
  .logo {
    text-align: center;
    i {
      font-size: 126px;
      color: #d81e06;
    }
  }
}
</style>
