<template>
  <div class="my" v-if="myarr.data">
    <!-- 头像部分 -->
    <div class="Head">
      <div class="content">
        <img :src="myarr.data.photo" alt="" @click="Golndividual" />
        <div class="myname">
          <div class="name">{{ myarr.data.name }}</div>
          <div class="confirm">申请认证</div>
        </div>
        <!-- 今日阅读 -->
        <div class="reading">
          <i class="iconfont icon-neirong"></i>
          <div>
            <div class="today">今天阅读</div>
            <div class="time">5分钟</div>
          </div>
        </div>
      </div>
      <!-- 动态、关注、粉丝部分 -->
      <div class="dongtai">
        <div class="myLi">
          {{ myarr.data.art_count }}
          <div>动态</div>
        </div>
        <div class="myLi">
          {{ myarr.data.follow_count }}
          <div>关注</div>
        </div>
        <div class="myLi">
          {{ myarr.data.fans_count }}
          <div>作品</div>
        </div>
      </div>
    </div>
    <!-- 收藏历史部分 -->
    <div class="Collection">
      <div class="CollectionLi">
        <div @click="collect" class="iconfont icon-shoucang myicon"></div>
        收藏
      </div>
      <div class="CollectionLi">
        <div @click="lishi" class="iconfont icon-time myicon"></div>
        历史
      </div>
      <div class="CollectionLi">
        <div class="iconfont icon-zuopin myicon"></div>
        作品
      </div>
    </div>
    <!-- 消息通知部分 -->
    <div class="Middle">
      <van-cell is-link title="消息通知" />
      <van-cell is-link title="实名认证" @click="GoAuthentication" />
    </div>
    <!-- 用户反馈部分 -->
    <div class="Under">
      <van-cell @click="xiaozhi" is-link title="小智同学" />
      <van-cell is-link title="系统设置" @click="goSetUp" />
    </div>
  </div>
</template>
<script>
import { getMy, grtLndividual } from '@/api/my.js'
// 导入vuex中的辅助函数
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 存储获取返回回来的数据
      myarr: ''
    }
  },
  created () {
    this.myGo()
    this.getLndiv()
  },
  methods: {
    // 转跳个人认证页面
    GoAuthentication () {
      this.$router.push('/Authentication')
    },
    // 转跳设置页面
    goSetUp () {
      this.$router.push('/SetUp')
    },
    // 渲染数据
    async myGo () {
      const res = await getMy()
      console.log(res)
      this.myarr = res
      // console.log(this.myarr)
      // 把返回的数据存储到vuex里面
      this.$store.commit('setUserInfo', this.myarr)
    },
    // 转跳我的资料页面
    Golndividual () {
      this.$router.push('/Individual')
    },
    // 收藏
    collect () {
      this.$router.push('/collect?d=0&name=收藏')
    },
    // 历史
    lishi () {
      this.$router.push('/collect?d=1&name=历史')
    },
    ...mapMutations(['setUserInfo']),
    async getLndiv () {
      const res = await grtLndividual()
      this.setUserInfo(res)
    },
    // 跳转到小智同学的页面
    xiaozhi () {
      this.$router.push('/zhi')
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f5f7f9;
  height: 100vh;
  .Head {
    width: 375px;
    height: 201px;
    background-color: #3d404d;
    .content {
      position: relative;
      padding-top: 58px;
      padding-left: 20px;
      display: flex;
      img {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background-color: #ffffff;
      }
      .myname {
        margin-left: 10px;
        margin-top: 10px;
        .name {
          font-size: 16px;
          color: #fff;
        }
        .confirm {
          width: 50px;
          margin-top: 6px;
          font-size: 4px;
          background-color: #fff;
          color: blue;
          border-radius: 10px;
          padding: 0px 6px;
        }
      }
      .reading {
        border-radius: 35px 0 0 35px;
        display: flex;
        color: #fff;
        height: 35px;
        margin-top: 12px;
        font-size: 12px;
        position: absolute;
        top: 56px;
        right: -10px;
        text-align: right;
        margin-right: 10px;
        padding: 5px 5px;
        padding-right: 20px;
        // border-right: 50px;
        background-color: #3b82c9;
        i {
          font-size: 26px;
          margin-top: 4px;
          margin-right: 4px;
        }

        .time {
          text-align: left;
          margin-right: 16px;
        }
      }
    }
    .dongtai {
      display: flex;
      font-size: 12px;
      .myLi {
        font-size: 16px;
        flex: 1;
        margin-top: 30px;
        color: #fff;
        text-align: center;
      }
      div {
        font-size: 10px;
      }
    }
  }
  .Collection {
    padding: 10px 0px;
    display: flex;
    width: 100%;
    background-color: #fff;
    .myicon {
      font-size: 26px;
    }
    .CollectionLi {
      flex: 1;
      text-align: center;
      font-size: 12px;
    }
  }
  .Middle {
    margin-top: 5px;
  }
  .Under {
    margin-top: 5px;
  }
  .but {
    margin-top: 20px;
  }
}
</style>
