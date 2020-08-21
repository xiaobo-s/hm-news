<template>
  <div class="follow">
    <hm-header>我的关注</hm-header>
    <!-- 关注列表 -->
    <div class="item" v-for="item in list" :key="item.id">
      <div class="left">
        <img :src="item.head_img | fixUrl" alt="" />
      </div>
      <div class="center">
        <p class="name">{{ item.nickname }}</p>
        <p class="time">{{ item.create_date | time }}</p>
      </div>
      <div class="right" @click="unFollow(item.id)">取消关注</div>
    </div>
    <p class="nomore" v-if="list.length === 0">暂无关注</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    // this.follow(1)
    // this.follow(2)
    // this.follow(3)
    // this.follow(4)
    // this.follow(5)
    // this.follow(6)
    this.getFollowList()
  },
  methods: {
    // 获取关注列表
    async getFollowList() {
      const res = await this.$axios.get('/user_follows')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        // console.log(this.list)
      }
    },
    // 取消关注
    async unFollow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '确认取消关注吗？'
        })
        const res = await this.$axios.get(`/user_unfollow/${id}`)
        // console.log(res)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.getFollowList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关注
    async follow(id) {
      const res = await this.$axios.get(`/user_follows/${id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success('关注成功')
        this.getFollowList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.follow {
  .item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    .left {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
    }
    .center {
      flex: 1;
      p {
        height: 20px;
        line-height: 20px;
      }
      .name {
        font-size: 16px;
        color: #333;
      }
      .time {
        font-size: 14px;
        color: #999;
      }
    }
    .right {
      height: 30px;
      line-height: 30px;
      margin-left: 10px;
      background-color: #e1e1e1;
      color: #333;
      border-radius: 15px;
      padding: 0 20px;
    }
  }
  .nomore {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
