<template>
  <div class="v1">
    <div class="login">
      <div class="middle">
        <van-form @submit="login">
          <van-field
            v-model="form.phone"
            name="myphone"
            placeholder="请输入手机号码"
            :rules="rules.phone"
            style="color:#fff;"
          >
            <template #left-icon>
              <i
                class="iconfont  icon-yuangongxinxi
"
              ></i>
            </template>
          </van-field>
          <van-field
            v-model="form.code"
            placeholder="请输入验证码"
            :rules="rules.code"
            style="color:#fff;"
          >
            <template #left-icon>
              <i class="iconfont  icon-mima"></i>
            </template>
            <template #button>
              <span
                class="code"
                @click="getcode"
                style="color:#fff;background-color:transparent;"
                >发送验证码</span
              >
            </template>
          </van-field>
          <div style="margin: 16px;">
            <van-button block type="info" style="color:#fff; font-size:24px;"
              >登录</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
    <ul class="bg-bubbles">
      <li v-for="(item, index) in bubbles" :key="index"></li>
    </ul>
  </div>
</template>

<script>
import { getLogineApi } from '../../api/getmessage.js'
import { localSet } from '../../utils/mylocal.js'
// 导入vuex中的辅助函数
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      bubbles: [],
      form: {
        phone: '13911112222',
        code: '246810'
      },
      rules: {
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'onBlur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号不合法',
            trigger: 'onBlur'
          }
        ],
        code: [{ required: true, message: '验证码不能为空', trigger: 'onBlur' }]
      }
    }
  },
  created () {
    this.bubbles.length = 10
  },
  methods: {
    // 获取验证码
    getcode () {
      // 发送请求获取验证码
      this.axios({
        url: ''
      })
      console.log('1111')
    },
    ...mapMutations(['setLoginStatus']),
    // 登录请求
    async login () {
      // 添加登录加载效果
      this.$toast({
        type: 'loading',
        message: '正在登录中...'
      })
      const res = await getLogineApi({
        mobile: this.form.phone,
        code: this.form.code
      })
      // if (this.form.phone) {
      //   return this.$toast.message('手机号码不正确')
      // }
      this.$toast.success('登录成功')
      console.log(res)
      // 保存data中的token
      localSet('token', res.data)
      // 保存用户登录状态
      this.setLoginStatus(true)
      // 登录成功后清除所有的toast
      this.$toast.clear()
      var params = this.$route.query._redirect
      if (params) {
        // 如果参数存在: 直接跳转到参数对应的路由中
        this.$router.push(params)
      } else {
        // 如果参数不存在：直接跳转到 my 页面
        this.$router.push('/my')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.v1 {
  background-image: linear-gradient(to bottom right, #3296fa, #00eda7);
  // background-color: #3296fa;
  height: 100vh;
  width: 375px;
  .login {
    z-index: 999;
    position: absolute;
    top: 50%;
    margin-top: -150px;
    margin-left: 25px;
    opacity: 0.8;
    ::v-deep .van-cell.van-field {
      background-color: transparent;
    }

    .top {
      width: 100%;
      height: 40px;
      background-color: #3e9df8;
      font-size: 16px;
      color: #fff;
      text-align: center;
      line-height: 40px;
    }
    .middle {
      .code {
        display: inline-block;
        width: 90px;
        height: 35px;
        background-color: #ededed;
        text-align: center;
        line-height: 35px;
        border-radius: 30px;
        font-size: 12px;
      }
      .iconfont {
        font-family: 'iconfont' !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .icon-yuangongxinxi:before {
        content: '\e62a';
        font-size: 20px;
      }

      // .icon-mima:before {
      //   content: '\e627';
      //   font-size: 20px;
      // }
    }
  }
  ::v-deep .van-button--info {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.15);
    border: 0.02667rem solid rgba(255, 255, 255, 0.15);
  }
  ::v-deep input.van-field__control {
    color: #fff;
  }
}
</style>
<style lang="less">
.bg-bubbles {
  position: absolute;
  // 使气泡背景充满整个屏幕
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;
  li {
    position: absolute;
    // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
    bottom: -100px;
    // 默认的气泡大小；
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    list-style: none;
    // 使用自定义动画使气泡渐现、上升和翻滚；
    animation: square 15s infinite;
    transition-timing-function: linear;
    // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
    &:nth-child(1) {
      left: 10%;
    }
    &:nth-child(2) {
      left: 20%;
      width: 90px;
      height: 90px;
      animation-delay: 2s;
      animation-duration: 7s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }
    &:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-duration: 8s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(5) {
      left: 70%;
    }
    &:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;
      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }
    &:nth-child(7) {
      left: 32%;
      width: 100px;
      height: 100px;
      animation-delay: 2s;
    }
    &:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
      animation-duration: 15s;
    }
    &:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 12s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(10) {
      left: 85%;
      width: 100px;
      height: 100px;
      animation-delay: 5s;
    }
  }
  // 自定义 square 动画；
  @keyframes square {
    0% {
      opacity: 0.5;
      transform: translateY(0px) rotate(45deg);
    }
    25% {
      opacity: 0.75;
      transform: translateY(-400px) rotate(90deg);
    }
    50% {
      opacity: 1;
      transform: translateY(-600px) rotate(135deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-1000px) rotate(180deg);
    }
  }
}
</style>
