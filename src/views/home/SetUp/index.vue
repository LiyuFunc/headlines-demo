<template>
  <div class="setup">
    <van-nav-bar class="tou" @click-left="onClickLeft">
      <template #title>
        <div class="mytouI">系统设置</div>
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
    <div class="mytou">
      <van-cell is-link title="清理缓存" @click="Caching" />
      <van-cell is-link title="播放与网络设置" />
      <van-cell is-link title="推送通知设置" />
      <van-cell center title="提示声音">
        <template #right-icon>
          <van-switch v-model="checked" size="24" />
        </template>
      </van-cell>
    </div>
    <div class="Middle">
      <van-cell center title="广告过滤">
        <template #right-icon>
          <van-switch v-model="checked1" size="24" />
        </template>
      </van-cell>
      <van-cell value="9.1.2" is-link title="检查版本" @click="myVersion" />
      <van-cell is-link title="关于我们" />
    </div>
    <van-button type="default" size="large" class="buts" @click="buts"
      >退出登录</van-button
    >
  </div>
</template>
<script>
import { localDel } from '../../../utils/mylocal'
import { Toast, Dialog } from 'vant'
export default {
  data () {
    return {
      checked: false,
      checked1: false
    }
  },
  methods: {
    // 清理缓存
    Caching () {
      Dialog.confirm({
        title: '是否清理'
      })
        .then(() => {
          // on confirm
          Toast.loading({
            forbidClick: true
          })
          setTimeout(() => {
            Toast.success('清理成功')
          }, 2000)
        })
        .catch(() => {})
    },
    // 退出按钮
    buts () {
      Dialog.confirm({
        title: '是否退出'
      })
        .then(() => {
          // on confirm
          localDel('token')
          this.$store.commit('setUserInfo', false)
          this.$router.push('/login')
          Toast.success('退出成功')
          console.log('退出成功')
        })
        .catch(() => {
          // on cancel
        })
      console.log(121)
    },
    // 点击版本出现弹框
    myVersion () {
      Toast.loading({
        message: '已经是最新版本',
        forbidClick: true
      })
    },
    // 返回my页面
    onClickLeft () {
      this.$router.push('/my')
    }
  }
}
</script>
<style lang="less" scoped>
.tou {
  background-color: #3d404d;
  .mytouI {
    color: #fff;
    font-weight: 600;
  }
  .mytous {
    color: #fff;
  }
}
.setup {
  background-color: #f0f0f0;
  .mytou {
    margin-top: 10px;
  }
  .Middle {
    margin-top: 10px;
  }
  .buts {
    color: red;
  }
}
</style>
