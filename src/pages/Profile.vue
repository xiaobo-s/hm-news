<template>
  <div class="profile">
    <!-- 头部信息 -->
    <div class="user-info" @click="$router.push('/edit-profile')">
      <!-- 头像 -->
      <div class="avatar">
        <img :src="imgSrc" alt />
      </div>
      <!-- 信息 -->
      <div class="info">
        <p class="name">
          <i v-if="profile.gender === 1" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          <span>{{ profile.nickname }}</span>
        </p>
        <p class="time">{{ profile.create_date | time }}</p>
      </div>
      <!-- 右箭头 -->
      <div class="icon">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list">
      <hm-nav name="我的关注" desc="关注的用户"></hm-nav>
      <hm-nav name="我的跟帖" desc="跟帖/回复"></hm-nav>
      <hm-nav name="我的收藏" desc="文章/视频"></hm-nav>
      <hm-nav name="设置" @click="$router.push('/edit-profile')"></hm-nav>
    </div>
    <div class="logout-btn">
      <van-button @click="logout" size="large" round type="info">
        退出
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    imgSrc() {
      return this.$axios.defaults.baseURL + this.profile.head_img
    }
  },
  data() {
    return {
      profile: {}
    }
  },
  methods: {
    async logout() {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '确认要退出吗？'
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        // 提示用户
        this.$toast.success('退出成功')
        // 跳转到登录页面
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
      }
    }
  },
  async created() {
    const id = localStorage.getItem('user_id')
    const token = localStorage.getItem('token')
    const res = await this.$axios.get(`/user/${id}`, {
      headers: {
        Authorization: token
      }
    })
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.profile = data
      // console.log(this.profile)
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  .user-info {
    display: flex;
    padding: 20px;
    border-bottom: 3px solid #ccc;
    .avatar {
      width: 70px;
      height: 70px;
      img {
        border-radius: 50%;
      }
    }
    .info {
      flex: 1;
      padding: 10px;
      line-height: 25px;
      .name {
        font-size: 16px;
        color: #333;
        .iconxingbienan {
          color: skyblue;
          margin-right: 5px;
        }
        .iconxingbienv {
          color: hotpink;
          margin-right: 5px;
        }
      }
      .time {
        font-size: 14px;
        color: #999;
      }
    }
    .icon {
      width: 30px;
      height: 70px;
      line-height: 70px;
      text-align: center;
    }
  }
  .logout-btn {
    padding: 20px;
  }
}
</style>
