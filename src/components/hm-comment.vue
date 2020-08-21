<template>
  <div class="hm-comment">
    <!-- 标题 -->
    <div class="title">
      <img :src="comment.user.head_img | fixUrl" alt />
      <div class="info">
        <div class="name">{{ comment.user.nickname }}</div>
        <div class="time">{{ comment.create_date | timeCalc }}</div>
      </div>
      <i ref="icon" class="iconfont iconjiantou2" @click="showFather"></i>
      <div class="reply" @click="reply(comment.id, comment.user.nickname)">回复</div>
    </div>

    <!-- 楼层组件 -->
    <div v-show="isShowFather">
      <hm-floor @reply="reply" :index="index" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    </div>
    <!-- 内容 -->
    <div class="content">{{ comment.content }}</div>
  </div>
</template>

<script>
import HmFloor from 'components/hm-floor.vue'
export default {
  components: {
    HmFloor
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      index: 0,
      isShowFather: false
    }
  },
  created() {
    let obj = this.comment.parent
    let count = 0
    while (obj) {
      count++
      obj = obj.parent
    }
    this.index = count
  },
  methods: {
    // 回复评论
    reply(id, nickname) {
      this.$emit('reply', id, nickname)
    },
    // 显示父评论
    showFather() {
      this.isShowFather = !this.isShowFather
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-comment {
  padding: 10px;
  border-bottom: 1px solid red;
  .iconjiantou2 {
    transform: rotate(-90deg);
    position: relative;
    margin-right: 5px;
    top: -10px;
  }
  .title {
    display: flex;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .info {
      flex: 1;
      .name {
        font-size: 14px;
      }
      .time {
        color: #999;
      }
    }
  }
  .content {
    padding: 10px 0;
    font-size: 14px;
  }
  .hm-floor {
    border: 1px solid #ccc;
    border-bottom: none;
  }
}
</style>
