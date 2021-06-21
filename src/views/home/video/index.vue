<template>
  <div class="video">
    <van-nav-bar>
      <template #title>
        <span class="topTitle">视频</span>
      </template>
    </van-nav-bar>
    <!-- <img src="../../../assets/头条导航栏.png" alt="" @click="Imgclick" />
    <img src="../../../assets/视频内容.png" alt="" @click="Imgclick" />
    <img src="../../../assets/视频内容2.png" alt="" @click="Imgclick" />
    <img src="../../../assets/视频内容3.png" alt="" @click="Imgclick" />
    <img src="../../../assets/视频内容4.png" alt="" @click="Imgclick" /> -->
    <div class="toutiao">
      <iframe src="https://m.ixigua.com/" frameborder="0" ref="iframe"></iframe>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style scoped lang="less">
.video {
  padding-bottom: 30px;
  /deep/ .van-icon-arrow-left {
    color: #fff;
  }
  /deep/.van-nav-bar__content {
    background-color: #3d404d;
  }
  img {
    width: 100%;
  }
  .toutiao {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -99999;
    width: 100%;
    height: 100vh;
    iframe {
      width: 100%;
      height: 100vh;
      margin-top: -50px;
    }
    /deep/ .xigua-download {
      display: none;
    }
  }
  .topTitle {
    color: #fff;
  }
}
</style>
