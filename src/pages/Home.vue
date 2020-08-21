<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="search" @click="$router.push('/search')">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right" @click="$router.push('/profile')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>

    <!-- tab栏 -->
    <van-tabs v-model="active" sticky animated swipeable>
      <van-tab v-for="item in tabsList" :key="item.id" :title="item.name">
        <van-pull-refresh v-model="item.refreshing" @refresh="onRefresh">
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            :offset="100"
          >
            <hm-posts :post="post" v-for="post in item.posts" :key="post.id">
              {{
              post.title
              }}
            </hm-posts>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    const active = localStorage.getItem('token') ? 1 : 0
    return {
      active: active,
      tabsList: [],
      pageSize: 5
    }
  },
  async created() {
    // 优先从本地加载
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    if (activeTabs) {
      activeTabs.forEach((item) => {
        item.posts = []
        item.pageIndex = 1
        item.loading = false
        item.finished = false
        item.refreshing = false
      })
      this.tabsList = activeTabs
    } else {
      await this.getTabsList()
    }
    this.getPostsList()
  },
  methods: {
    // 获取tab栏的数据
    async getTabsList() {
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        data.forEach((item) => {
          item.posts = []
          item.pageIndex = 1
          item.loading = false
          item.finished = false
          item.refreshing = false
        })
        this.tabsList = data
        // console.log(data)
      }
    },
    // 获取当前tab栏的文章列表
    async getPostsList() {
      // 获取当前tab栏的下标
      const index = this.active
      // 获取id
      const id = this.tabsList[index].id
      // console.log(id)
      // 根据id发送请求
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.tabsList[index].pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabsList[index].posts = [...this.tabsList[index].posts, ...data]
        this.tabsList[index].loading = false
        if (data.length < this.pageSize) {
          this.tabsList[index].finished = true
        }
      }
    },
    // 加载更多
    onLoad() {
      // console.log('加载更多')
      const index = this.active
      // 如果是下拉刷新,不需要额外触发触底
      if (this.tabsList[index].refreshing) return
      this.tabsList[index].pageIndex++
      this.getPostsList()
    },
    // 下拉刷新
    onRefresh() {
      const index = this.active
      this.tabsList[index].posts = []
      this.tabsList[index].pageIndex = 1
      this.tabsList[index].loading = false
      this.tabsList[index].finished = false
      this.getPostsList()
      // 刷新成功后
      this.tabsList[index].refreshing = false
      this.$toast('刷新成功')
    }
  },
  watch: {
    active() {
      const index = this.active
      this.tabsList[index].loading = false
      this.tabsList[index].finished = false
      if (this.tabsList[index].posts.length > 0) return
      this.getPostsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  .header {
    display: flex;
    height: 50px;
    line-height: 50px;
    background-color: #ff0000;
    color: #fff;
    text-align: center;
    .left {
      width: 70px;
      .iconnew {
        font-size: 50px;
      }
    }
    .search {
      flex: 1;
      background-color: rgba(255, 255, 255, 0.5);
      height: 36px;
      line-height: 36px;
      margin-top: 7px;
      border-radius: 18px;
      span {
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .right {
      width: 70px;
      .iconwode {
        font-size: 20px;
      }
    }
  }
}
</style>
