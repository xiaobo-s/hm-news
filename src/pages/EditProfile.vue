<template>
  <div class="edit-profile">
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="imgSrc" alt />
      <van-uploader :after-read="afterRead"></van-uploader>
    </div>
    <hm-nav @click="showNickname" name="昵称" :desc="profile.nickname"></hm-nav>
    <hm-nav @click="showPassword" name="密码" desc="******"></hm-nav>
    <hm-nav @click="showGender" name="性别" :desc="profile.gender === 1 ? '男' : '女'"></hm-nav>

    <!-- 编辑昵称 -->
    <van-dialog @confirm="editNickname" v-model="isShowNickname" title="编辑昵称" show-cancel-button>
      <van-field v-model="nickname" placeholder="请输入昵称" />
    </van-dialog>

    <!-- 编辑密码 -->
    <van-dialog @confirm="editPassword" v-model="isShowPassword" title="编辑密码" show-cancel-button>
      <van-field
        @click-right-icon="changeCanSee"
        :type="canSeePass ? 'text' : 'password'"
        :right-icon="canSeePass ? 'closed-eye' : 'eye-o' "
        v-model="password"
        placeholder="请输入密码"
      />
    </van-dialog>

    <!-- 编辑性别 -->
    <van-dialog @confirm="editGender" v-model="isShowGender" title="编辑性别" show-cancel-button>
      <van-radio-group v-model="gender" direction="horizontal">
        <van-radio :name="1">男</van-radio>
        <van-radio :name="0">女</van-radio>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {},
      isShowNickname: false,
      nickname: '',
      nickRules: /^[\u4e00-\u9fa5]{2,6}$/,
      password: '',
      isShowPassword: false,
      canSeePass: true,
      passRules: /^\w{3,11}$/,
      isShowGender: false,
      gender: 1
    }
  },
  created() {
    this.getProfile()
  },
  methods: {
    // 发送请求获取个人信息(封装)
    async getProfile() {
      const id = localStorage.getItem('user_id')
      const res = await this.$axios.get(`/user/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.profile = data
      }
    },
    // 发送请求修改信息(封装)
    async editProfile(dataObj) {
      const id = this.profile.id
      const res = await this.$axios.post(`/user_update/${id}`, dataObj)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getProfile()
      }
    },
    // 显示修改昵称对话框
    showNickname() {
      this.isShowNickname = true
      this.nickname = this.profile.nickname
    },
    // 修改昵称
    async editNickname() {
      if (!this.nickRules.test(this.nickname)) {
        this.$toast('操作失败,请输入2-6位的中文字符')
        return
      }
      this.editProfile({ nickname: this.nickname })
    },
    // 显示修改密码对话框
    showPassword() {
      this.isShowPassword = true
      this.password = this.profile.password
    },
    // 显示密码是否可见
    changeCanSee() {
      this.canSeePass = !this.canSeePass
    },
    // 修改密码
    editPassword() {
      if (!this.passRules.test(this.password)) {
        this.$toast('操作失败,请输入3-11位的字符')
        return
      }
      this.editProfile({ password: this.password })
    },
    // 显示性别对话框
    showGender() {
      this.isShowGender = true
      this.gender = this.profile.gender
    },
    // 修改性别
    editGender() {
      this.editProfile({ gender: this.gender })
    },
    // 修改头像
    async afterRead(file) {
      // file.file 用于上传的文件对象
      // file.content 用于预览图片
      // 创建formData对象
      const fd = new FormData()
      fd.append('file', file.file)
      const res = await this.$axios.post('/upload', fd)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.editProfile({ head_img: data.url })
      }
    }
  },
  computed: {
    imgSrc() {
      return this.$axios.defaults.baseURL + this.profile.head_img
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-profile {
  .avatar {
    padding: 30px 0;
    position: relative;
    img {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      border-radius: 50%;
    }
    .van-uploader {
      position: absolute;
      left: 50%;
      top: 30px;
      transform: translateX(-50%);
      opacity: 0;
    }
  }
  // 组件样式(组件的根元素会添加上和组件名相同的类)
  .van-dialog {
    padding: 0 20px;
    .van-field {
      border: 1px solid #ccc;
      margin: 10px 0;
    }
  }
  // 单选框样式
  .van-radio-group {
    padding: 20px 0;
    justify-content: space-around;
  }
}
</style>
