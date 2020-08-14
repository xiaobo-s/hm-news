<template>
  <div class="login">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <hm-input
        v-model="username"
        type="text"
        placeholder="请输入手机号"
        :rules="userRules"
        err-msg="请输入正确的手机号"
      ></hm-input>
    </div>
    <div class="password">
      <hm-input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        :rules="passRules"
        err-msg="请输入正确的密码"
      ></hm-input>
    </div>
    <div class="login-btn">
      <hm-button @click="loginFn">登录</hm-button>
    </div>
    <div class="go-register">
      没有账号？立即
      <router-link to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
import HmInput from 'components/hm-input.vue'
import HmButton from 'components/hm-button.vue'
export default {
  data() {
    return {
      username: '',
      password: '',
      userRules: /^1\d{4,10}$/,
      passRules: /^\w{3,11}$/
    }
  },
  components: {
    HmInput,
    HmButton
  },
  created() {
    const { username, password } = this.$route.params
    if (username && password) {
      this.username = username
      this.password = password
    }
  },
  methods: {
    async loginFn(e) {
      // 发送请求前进行数据校验
      if (!this.userRules.test(this.username)) {
        this.$toast('请输入正确的用户名')
        return
      }
      if (!this.passRules.test(this.password)) {
        this.$toast('请输入正确的密码')
        return
      }
      // 发送请求
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', user.id)
        this.$router.push('/profile')
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
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
  .go-register {
    padding: 20px 0;
    text-align: center;
    font-size: 18px;
    a {
      color: blue;
    }
  }
}
</style>
