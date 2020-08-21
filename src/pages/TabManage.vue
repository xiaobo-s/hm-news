<template>
  <div class="tab-manage">
    <hm-header>栏目管理</hm-header>
    <div class="content">
      <div class="title">点击删除以下频道</div>
      <div class="list">
        <div
          @click="del(index)"
          class="item"
          v-for="(item,index) in activeTabs"
          :key="item.id"
        >{{item.name}}</div>
      </div>

      <div class="title">点击添加以下频道</div>
      <div class="list">
        <div
          @click="add(index)"
          class="item"
          v-for="(item, index) in deactiveTabs"
          :key="item.id"
        >{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabs: [],
      deactiveTabs: []
    }
  },
  created() {
    // 优先从本地加载数据
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    const deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
    if (activeTabs && deactiveTabs) {
      this.activeTabs = activeTabs
      this.deactiveTabs = deactiveTabs
    } else {
      this.getTabList()
    }
  },
  methods: {
    // 获取所有频道
    async getTabList() {
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.activeTabs = data
        // console.log(this.activeTabs)
      }
    },
    // 删除频道
    del(index) {
      if (index === 0 || index === 1) {
        this.$toast('不能删除此频道')
        return
      }
      // 将删除的选项添加到下面列表中
      this.deactiveTabs.push(this.activeTabs[index])
      // 删除选择的频道
      this.activeTabs.splice(index, 1)
    },
    // 添加频道
    add(index) {
      // 将选择的频道添加到上面列表中
      this.activeTabs.push(this.deactiveTabs[index])
      // 删除选择的频道
      this.deactiveTabs.splice(index, 1)
    }
  },
  watch: {
    activeTabs() {
      // 数据一旦变化,将数组存储到本地
      localStorage.setItem('activeTabs', JSON.stringify(this.activeTabs))
      localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 10px;
  .title {
    font-size: 12px;
    color: #999;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;
    .item {
      width: 60px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      font-size: 14px;
      margin-right: 8px;
      margin-bottom: 6px;
    }
  }
}
</style>
