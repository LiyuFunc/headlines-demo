<template>
  <div class="Authentication">
    <div class="tou">
      <van-nav-bar class="mytou" @click-left="onClickLeft">
        <template #title>
          <div class="mytouI">实名认证</div>
        </template>
        <template #left>
          <van-icon
            size="25"
            name="arrow-left"
            class="mytous"
            @click="onClickLeft"
          />
        </template>
      </van-nav-bar>
      <van-steps>
        <van-step>实名认证</van-step>
        <van-step>脸部识别</van-step>
        <van-step>认证完成</van-step>
      </van-steps>
    </div>
    <div class="Middle">
      <img src="../../../../assets/生分证.png" alt="" />
    </div>
    <div class="tuPian">
      <img src="../../../../assets/上传生分证.png" alt="" />
    </div>
    <div class="buts">
      <van-button type="info" size="large">下一步</van-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onClickLeft () {
      this.$router.push('/my')
    }
  }
}
</script>
<style lang="less" scoped>
.tou {
  color: #f5f7f9;
  .mytou {
    background-color: #3d404d;
    .mytouI {
      color: #fff;
      font-weight: 600;
    }
    .mytous {
      color: #fff;
    }
  }
}
.Authentication {
  padding: 0px;
  background-color: #f5f7f9;
  .Middle {
    margin-top: 10px;
    img {
      width: 100%;
    }
  }
  .tuPian {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .buts {
    padding: 10px;
  }
}
</style>
