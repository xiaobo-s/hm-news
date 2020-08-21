<template>
  <div class="favorite">
    <hm-header>我的收藏</hm-header>
    <hm-posts v-for="post in list" :key="post.id" :post="post"></hm-posts>
    <div class="tips" v-if="this.list.length === 0">暂无数据...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  async created() {
    const res = await this.$axios.get('/user_star')
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      data.forEach((item) => {
        item.comment_length = item.comments.length
      })
      this.list = data
      // console.log(this.list)
    }
  }
}
</script>

<style lang="scss" scoped>
.favorite {
  .item {
    display: flex;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        color: #333;
        font-size: 16px;
      }
      .bottom {
        color: #999;
        font-size: 12px;
        span:first-child {
          margin-right: 10px;
        }
      }
    }
    .img-box {
      width: 120px;
      height: 75px;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .tips {
    font-size: 20px;
    text-align: center;
    color: red;
  }
}
</style>
