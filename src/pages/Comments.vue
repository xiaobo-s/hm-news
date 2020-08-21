<template>
  <div class="comments">
    <hm-header>我的跟帖</hm-header>
    <!-- 跟帖数据 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      :offset="100"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="time">{{item.create_date | time}}</div>
        <!-- 父级跟帖数据 -->
        <div class="parent" v-if="item.parent">
          <p>回复: {{item.parent.user.nickname}}</p>
          <p>{{item.parent.content}}</p>
        </div>
        <div class="content">{{item.content}}</div>
        <div class="origin">
          <p class="one-txt-cut">原文:{{item.post.title}}</p>
          <span class="iconfont iconjiantou1"></span>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false, // 默认不在加载中，触底触发事件加载更多
      finished: false, // 默认没有全部加载完
      pageIndex: 1, // 当前页
      pageSize: 5 // 每页条数
    }
  },
  created() {
    this.getComments()
  },
  methods: {
    async getComments() {
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = [...this.list, ...data]
        // console.log(this.list)
        // 加载完成后将loading重置为false
        this.loading = false
        // 如果没有更多数据,将finished改为true
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    // 触底事件
    onLoad() {
      // 触底后加载下一页
      console.log('触底了')
      this.pageIndex++
      this.getComments()
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  line-height: 30px;
  .time {
    color: #999;
    font-size: 14px;
  }
  .content {
    color: #333;
    font-size: 16px;
  }
  .origin {
    color: #999;
    font-size: 14px;
    display: flex;
    margin-top: 10px;
    .one-txt-cut {
      flex: 1;
    }
  }
  .parent {
    margin: 10px 0;
    background-color: #ddd;
    padding: 10px;
    border-radius: 5px;
    p:first-child {
      font-size: 12px;
    }
  }
}
</style>
