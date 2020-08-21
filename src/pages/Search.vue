<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="back">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="search-box">
        <van-search v-model="keyword" placeholder="请输入关键字"></van-search>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>

    <!-- 历史记录和热门搜索 -->
    <div class="content" v-if="postList.length === 0">
      <div class="history">
        <h3>历史记录</h3>
        <ul>
          <li @click="hotSearch(item)" v-for="item in history" :key="item.id ">{{item}}</li>
        </ul>
      </div>
      <div class="hot-search">
        <h3>热门搜索</h3>
        <ul>
          <li @click="hotSearch(item)" v-for="item in hotKeys" :key="item.id">{{item}}</li>
        </ul>
      </div>
    </div>

    <!-- 展示搜索列表 -->
    <div class="post-list" v-if="postList.length > 0">
      <hm-posts v-for="item in postList" :key="item.id" :post="item"></hm-posts>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      postList: [],
      history: [],
      hotKeys: ['说好不哭', '王祖贤', '性感女歌手']
    }
  },
  created() {
    const history = JSON.parse(localStorage.getItem('history'))
    if (history) {
      this.history = history
    }
  },
  methods: {
    // 输入关键字进行搜索
    async search() {
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword
        }
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        if (data.length === 0) {
          this.$toast('暂无数据,请更换关键字')
        }
        this.postList = data
        // 删除重复关键字
        this.history = this.history.filter((item) => item !== this.keyword)
        // 将搜索关键字添加到历史记录
        this.history.unshift(this.keyword)
        // 添加到本地
        localStorage.setItem('history', JSON.stringify(this.history))
      }
    },
    // 热搜
    hotSearch(item) {
      // 修改关键字
      this.keyword = item
      this.search()
    },
    // 返回
    back() {
      if (this.postList.length > 0) {
        this.postList = []
        this.keyword = ''
      } else {
        this.$router.go(-1)
      }
    }
  },
  watch: {
    // 搜索关键字清空时，恢复默认界面
    keyword() {
      if (this.keyword.trim() === '') {
        this.postList = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  line-height: 50px;
  display: flex;
  border-bottom: 1px solid #ccc;
  .left {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .search-box {
    flex: 1;
    .van-search {
      background-color: transparent;
      padding: 0;
      margin-top: 7px;
      border: 1px solid #ccc;
      border-radius: 18px;
      overflow: hidden;
    }
  }
  .right {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
  }
}
.history,
.hot-search {
  padding: 10px;
  h3 {
    font-size: 16px;
    font-weight: 700;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      padding: 5px 10px;
      font-size: 14px;
    }
  }
}
</style>
