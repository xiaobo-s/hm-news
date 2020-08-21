<template>
  <div class="hm-floor">
    <!-- 父评论 -->
    <hm-floor @reply="reply" v-if="comment.parent" :comment="comment.parent" :index="index - 1"></hm-floor>
    <div class="main">
      <div class="title">
        <div class="name">{{ index }}楼: {{ comment.user.nickname }}</div>
        <div class="time">{{ comment.create_date | timeCalc }}</div>
        <div class="reply" @click="reply(comment.id, comment.user.nickname)">回复</div>
      </div>
      <div class="content">{{ comment.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hm-floor',
  props: {
    comment: Object,
    index: Number
  },
  methods: {
    reply(id, nickname) {
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="scss" scoped>
.hm-floor {
  .main {
    padding: 0 20px;
    background-color: #eee;
    border-bottom: 1px solid #ccc;
    .title {
      display: flex;
      align-items: flex-end;
      padding-bottom: 10px;
      .name {
        font-size: 14px;
      }
      .time {
        color: #888;
        margin-left: 5px;
        flex: 1;
      }
    }
  }
}
</style>
