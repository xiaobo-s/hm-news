<template>
  <div class="post-detail" v-if="!loading">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.go(-1)">
        <i class="iconfont iconjiantou2"></i>
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div class="btn-followed" v-if="post.has_follow" @click="unfollow">
          已关注
        </div>
        <div class="btn-follow" v-else @click="follow">关注</div>
      </div>
    </div>

    <!-- 文章详情 -->
    <div class="main">
      <div class="title">{{ post.title }}</div>
      <div class="info">
        <span>{{ post.user.nickname }}</span>
        <span>{{ post.create_date | time }}</span>
      </div>
      <!-- 视频 -->
      <div class="video-box" v-if="post.type === 2">
        <video :src="post.content" controls></video>
      </div>
      <div v-else class="content" v-html="post.content"></div>

      <!-- 点赞和分享 -->
      <div class="btns">
        <div class="good" @click="like" :class="{ like: post.has_like }">
          <i class="iconfont icondianzan"></i>
          <span>{{ post.like_length }}</span>
        </div>
        <div class="share">
          <i class="iconfont iconweixin"></i>
          <span>微信</span>
        </div>
      </div>
    </div>

    <!-- 精彩跟帖 -->
    <div class="post-comment">
      <h3>精彩跟帖</h3>

      <!-- 评论组件 -->
      <div v-if="commentList.length > 0">
        <hm-comment
          @reply="reply"
          v-for="item in commentList"
          :key="item.id"
          :comment="item"
        ></hm-comment>
      </div>
      <!-- 无评论时展示 -->
      <div class="tips" v-if="commentList.length === 0">
        暂无跟帖！赶快抢占沙发！
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <!-- 普通输入框 -->
      <div class="comment-input" v-if="!isFocus">
        <input @focus="handleFocus" type="text" placeholder="写跟帖" />
        <div class="icon-comment">
          <i class="iconfont iconpinglun-"></i>
          <span>{{ commentList.length }}</span>
        </div>
        <i
          @click="star"
          :class="{ star: post.has_star }"
          class="iconfont iconshoucang"
        ></i>
        <i class="iconfont iconfenxiang"></i>
      </div>
      <!-- 文本域输入框 -->
      <div class="comment-textarea" v-else>
        <textarea
          v-model="content"
          v-focus
          ref="txt"
          @blur="handleBlur"
          :placeholder="placeholder"
          rows="3"
        ></textarea>
        <div @click="send" class="send">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import HmComment from 'components/hm-comment.vue'
export default {
  components: {
    HmComment
  },
  data() {
    return {
      post: {},
      loading: true,
      isFocus: false,
      commentList: [],
      content: '',
      placeholder: '评论:',
      parentId: ''
    }
  },
  async created() {
    await this.getPostDetail()
    this.getCommentList()
  },
  methods: {
    // 获取新闻详情
    async getPostDetail() {
      // 加载提示
      this.$toast.loading({
        message: '加载中...',
        duration: 0,
        forbidClick: true
      })
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        this.loading = false
        // console.log(this.post)
      }
      this.$toast.clear()
    },
    // 获取评论列表
    async getCommentList() {
      const id = this.post.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
        // console.log(this.commentList)
      }
    },
    // 关注
    async follow() {
      const id = this.post.user.id
      const res = await this.$axios.get(`/user_follows/${id}`)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // this.post.has_follow = true
        await this.getPostDetail()
        this.$toast(message)
      }
    },
    // 取消关注
    async unfollow() {
      const id = this.post.user.id
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // this.post.has_follow = false
        await this.getPostDetail()
        this.$toast(message)
      }
    },
    // 点赞
    async like() {
      const id = this.post.id
      const res = await this.$axios.get(`/post_like/${id}`)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        await this.getPostDetail()
        this.$toast.success(message)
      }
    },
    // 收藏
    async star() {
      const id = this.post.id
      const res = await this.$axios.get(`/post_star/${id}`)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.getPostDetail()
        this.$toast.success(message)
      }
    },
    // 获得焦点
    handleFocus() {
      this.isFocus = true
      // 自动获取焦点
      // this.$nextTick(() => this.$refs.txt.focus())
    },
    // 失去焦点
    handleBlur() {
      if (this.content) return
      this.parentId = ''
      this.placeholder = '评论:'
      this.isFocus = false
    },
    // 发表评论
    async send() {
      if (this.content.trim() === '') return
      const id = this.$route.params.id
      const res = await this.$axios.post(`/post_comment/${id}`, {
        content: this.content,
        parent_id: this.parentId
      })
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 清空内容
        this.content = ''
        // 关闭文本框
        this.isFocus = false
        // 清除parentId
        this.parentId = ''
        // 回复placeholder
        this.placeholder = '评论:'
        this.getCommentList()
      }
    },
    // 点击回复显示输入框
    reply(id, nickname) {
      this.isFocus = true
      this.placeholder = '回复: @' + nickname
      // 将id存储
      this.parentId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.post-detail {
  padding-bottom: 70px;
  .header {
    display: flex;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    .left {
      i {
        vertical-align: middle;
      }
      .iconnew {
        font-size: 50px;
      }
    }
    .right {
      .btn-followed,
      .btn-follow {
        border: 1px solid #ccc;
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 15px;
      }
      .btn-follow {
        background-color: red;
        color: #fff;
      }
    }
  }
  .main {
    padding: 10px;
    .title {
      font-size: 16px;
      color: #222;
      font-weight: 700;
    }
    .info {
      font-size: 12px;
      color: #999;
      padding: 10px 0;
      span:first-child {
        margin-right: 10px;
      }
    }
    .content {
      font-size: 14px;
    }
    video {
      width: 100%;
    }
    .btns {
      display: flex;
      justify-content: space-around;
      padding: 20px 0;
      .good,
      .share {
        height: 30px;
        line-height: 26px;
        border-radius: 15px;
        text-align: center;
        border: 1px solid #ccc;
        padding: 0 20px;
        .iconfont {
          font-size: 14px;
          margin-right: 5px;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
        .iconweixin {
          color: green;
        }
      }
      .like {
        background-color: red;
        color: white;
      }
    }
  }
  .post-comment {
    h3 {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
    }
    .tips {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      text-align: center;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid #ccc;
    background-color: #f2f2f2;
    .comment-input {
      display: flex;
      justify-content: space-around;
      align-items: center;
      input {
        width: 180px;
        height: 30px;
        border-radius: 15px;
        background-color: #d7d7d7;
        padding-left: 20px;
        font-size: 14px;
      }
      .iconfont {
        font-size: 20px;
      }
      .icon-comment {
        position: relative;
        span {
          position: absolute;
          left: 10px;
          top: -8px;
          height: 20px;
          line-height: 20px;
          padding: 0 5px;
          border-radius: 5px;
          background-color: red;
          color: #fff;
          font-size: 10px;
        }
      }
      .star {
        color: red;
      }
    }
    .comment-textarea {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      textarea {
        width: 200px;
        height: 90px;
        border-radius: 5px;
        background-color: #d7d7d7;
        padding: 10px;
      }
      .send {
        width: 60px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        background-color: red;
        color: #fff;
        border-radius: 13px;
      }
    }
  }
}
</style>
