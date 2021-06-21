<template>
  <div class="collect">
    <!-- 头部导航栏 -->
    <div>
      <van-nav-bar class="top">
        <template #left>
          <van-icon
            @click="$router.push('/my')"
            class="icon"
            name="arrow-left"
          />
        </template>
        <!-- 中间的文本 -->
        <template #title>
          {{ $route.query.name }}
        </template>
      </van-nav-bar>
    </div>
    <!-- 收藏/历史 -->
    <div class="histor">
      <span :class="{ avtice: currIndex === '0' }">我的收藏</span>
      <span :class="{ avtice: currIndex === '1' }">我的历史</span>
    </div>
    <!-- 数据 -->
    <div class="data">
      <div class="wen">
        <span
          >使用Filnk进行高吞吐，低延迟和Exactly-Once语义处理
          <span>黑马程序员 2018-8-29</span>
        </span>
        <div class="img">
          <img
            src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4206730094,4039576056&fm=26&gp=0.jpg"
            alt=""
          />
        </div>
      </div>
      <ul class="ullist">
        <li><i class="iconfont icon-pinglun1"></i>评论</li>
        <li><i class="iconfont icon-good"></i>点赞</li>
        <li><i class="iconfont icon-shoucang"></i>收藏</li>
      </ul>
    </div>
    <div class="dian">
      <div class="title">用Supervisor实现进程守护，在异常退出时自动重启</div>
      <ul class="imglist">
        <li>
          <img
            src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2020964365,2902699634&fm=26&gp=0.jpg"
          />
        </li>
        <li>
          <img
            src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2352508959,4197561698&fm=26&gp=0.jpg"
          />
        </li>
        <li>
          <img
            src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2498298606,1897892496&fm=26&gp=0.jpg"
          />
        </li>
      </ul>
      <span>黑马程序员 2018-8-29</span>
      <ul class="ullist">
        <li><i class="iconfont icon-pinglun1"></i>评论</li>
        <li><i class="iconfont icon-good"></i>点赞</li>
        <li><i class="iconfont icon-shoucang"></i>收藏</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currIndex: null
    }
  },
  created () {
    this.currIndex = this.$route.query.d
    // console.log(this.currIndex)
  }
}
</script>

<style lang="less" scoped>
.avtice {
  padding: 10px 0;
  color: #3296fa;
  border-bottom: 1px solid #3296fa;
}
.collect {
  height: 700px;
  background-color: #f9f9f9;
  .top {
    background-color: #3d404d;
    height: 45px;
    width: 100%;
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
    .icon {
      font-size: 20px;
      color: #fff;
    }
  }
  .histor {
    display: flex;
    font-size: 16px;
    justify-content: space-around;
    background-color: #fff;
    span {
      padding: 10px 0;
      // color: #3296fa;
      // border-bottom: 1px solid #3296fa;
    }
  }
  .data {
    margin-top: 8px;
    padding: 10px 15px;
    background-color: #fff;
    .wen {
      display: flex;
      span {
        font-size: 16px;
        flex: 2;
        span {
          display: inline-block;
          font-size: 14px;
          color: #c6c6c6;
          padding-top: 5px;
        }
      }
      .img {
        flex: 1;
        width: 40px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .ullist {
      display: flex;
      justify-content: space-around;
      padding-top: 20px;
      li {
        font-size: 16px;
        .iconfont {
          font-size: 18px;
          padding-right: 5px;
        }
      }
    }
  }
  .dian {
    margin-top: 8px;
    padding: 10px 15px;
    background-color: #fff;
    .title {
      font-size: 16px;
    }
    span {
      font-size: 14px;
      color: #c6c6c6;
      padding-top: 10px;
      display: inline-block;
    }
    .imglist {
      display: flex;
      li {
        flex: 1;
        width: 60px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .ullist {
      display: flex;
      justify-content: space-around;
      padding-top: 20px;
      li {
        font-size: 16px;
        .iconfont {
          font-size: 18px;
          padding-right: 5px;
        }
      }
    }
  }
}
</style>
