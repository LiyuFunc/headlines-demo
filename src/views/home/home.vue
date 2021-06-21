<template>
  <div>
    <!-- 设置路由出口 -->
    <router-view></router-view>
    <van-tabbar route v-if="$route.meta.needTab">
      <van-tabbar-item to="/index" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
/deep/ .van-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99999 !important;
}
</style>
