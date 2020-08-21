<template>
  <div class="hm-posts" @click="$router.push(`/post-detail/${post.id}`)">
    <!-- 视频类文章 -->
    <div class="video-post" v-if="post.type === 2">
      <div class="title txt-cut">{{ post.title }}</div>
      <div class="video-box">
        <img :src="post.cover[0].url" alt />
        <i class="iconfont iconshipin"></i>
      </div>
      <div class="bottom">
        <span>{{ post.user.nickname }}</span>
        <span>{{ post.comment_length }}跟帖</span>
      </div>
    </div>

    <!-- 单图片文章 -->
    <div class="single-img-post" v-else-if="post.cover.length < 3">
      <div class="info">
        <div class="title txt-cut">{{ post.title }}</div>
        <div class="bottom">
          <span>{{ post.user.nickname }}</span>
          <span>{{ post.comment_length }}跟帖</span>
        </div>
      </div>
      <div class="img-box">
        <img :src="post.cover[0].url" alt />
      </div>
    </div>

    <!-- 三图片文章 -->
    <div class="multiple-imgs-post" v-else>
      <div class="info">
        <div class="title txt-cut">{{ post.title }}</div>
        <div class="imgs-box">
          <img v-for="item in post.cover" :key="item.id" :src="item.url" alt />
        </div>
      </div>
      <div class="bottom">
        <span>{{ post.user.nickname }}</span>
        <span>{{ post.comment_length }}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  }
}
</script>

<style lang="scss" scoped>
.hm-posts {
  .title {
    color: #333;
    font-size: 14px;
  }
  .bottom {
    color: #999;
    font-size: 12px;
    span:first-child {
      margin-right: 10px;
    }
  }
}
.single-img-post {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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

.multiple-imgs-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .imgs-box {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    img {
      width: 112px;
      height: 74px;
      object-fit: cover;
    }
  }
}

.video-post {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .video-box {
    padding: 10px;
    position: relative;
    .iconshipin {
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.4);
      color: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      font-size: 30px;
    }
  }
}
</style>
