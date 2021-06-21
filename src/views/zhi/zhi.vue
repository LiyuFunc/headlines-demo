<template>
  <div class="zhi">
    <!-- 页面头部 -->
    <van-nav-bar
      left-arrow
      class="mynav"
      title="小智同学"
      :fixed="true"
      @click-left="$router.back()"
    />
    <!-- 聊天区域 -->
    <div class="chat" ref="chat">
      <div class="item" v-for="(item, index) in charList" :key="index">
        <div :class="item.isRoboto ? 'roboto' : 'user'">
          <img
            src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=56927854,3422561174&fm=26&gp=0.jpg"
            alt=""
          />
          <span>{{ item.msg }}</span>
        </div>
      </div>
    </div>
    <!-- 信息发送区域 -->
    <van-search
      class="mysearch"
      v-model="value"
      left-icon=""
      show-action
      shape="round"
      background="#ccc"
      @search="onSearch"
    >
      <template #action>
        <span @click="sendmsg">发送</span>
      </template>
    </van-search>
  </div>
</template>

<script>
// 导入操作 localstorage 的方法
// import { localGet } from '@/utils/mylocal'
// 导入 io
import io from 'socket.io-client'
export default {
  data () {
    return {
      // 输入框中的内容
      value: '',
      // 创建一个 socket 对象
      socket: null,
      // 聊天列表
      charList: [{ isRoboto: true, msg: '我是小智同学！！！' }]
    }
  },
  methods: {
    onSearch (value) {},
    // 发送消息到服务器
    sendmsg () {
      this.socket.emit('message', {
        msg: this.value,
        timestamp: Date.now()
      })
      // 将数据保存到 charList 中
      this.charList.push({
        isRoboto: false,
        msg: this.value
      })
      this.$nextTick(() => {
        // 滚动条滚动到底部
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
      })
    }
  },
  created () {
    // 在开打页面时连接服务器
    // this.socket = io(
    //   `http://ttapi.research.itcast.cn?token=${localGet('token').token}`
    // )
    this.socket = io('http://localhost:3000')
    // 接收服务器返回的数据
    this.socket.on('message', val => {
      // val => { msg: '', timestamp }
      console.log('服务器返回的内容为： ---------------')
      // 将数据保存到 charList 中
      this.charList.push({
        isRoboto: true,
        msg: val.msg
      })
      this.$nextTick(() => {
        // 滚动条滚动到底部
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
      })
    })
  }
}
</script>

<style lang="less" scoped>
.zhi {
  margin-top: 46px;
  .mynav {
    background-color: #3d404d;
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
    /deep/ i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: #fff;
    }
  }
  .chat {
    position: fixed;
    top: 46px;
    bottom: 54px;
    left: 0px;
    right: 0px;
    background: pink;
    overflow: auto;
    .item {
      margin: 10px;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
      }
      span {
        padding: 10px;
        background-color: #ccc;
      }
    }
    .roboto {
      width: 100%;
      img,
      span {
        float: left;
      }
    }
    .user {
      width: 100%;
      img,
      span {
        float: right;
      }
      img {
        margin-left: 10px;
        margin-right: 0px;
      }
    }
  }
  .mysearch {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
  }
}
</style>
