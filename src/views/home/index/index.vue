<template>
  <div class="index">
    <div class="position">
      <!-- 导航栏 -->
      <van-nav-bar style="background-color:#3296fa;">
        <template #left>
          <div class="iconf">
            <i
              class="iconfont icon-sousuo"
              @click="$router.push('/search')"
            ></i>
          </div>
        </template>
        <template #title>
          <div class="hd">主页</div>
        </template>
        <template #right>
          <div class="icon">
            <van-icon name="bars" @click="showPopup" />
          </div>
        </template>
      </van-nav-bar>
      <!-- 主页切换栏 使用组件：Tab 标签页 -->
      <div class="bar">
        <van-tabs v-model="active" @change="onRefresh">
          <van-tab
            v-for="(item, index) in userNewsList"
            :key="index"
            :name="item.id"
            @click="currIndex = index"
          >
            <template #title>
              <div class="item">
                {{ item.name }}
              </div>
            </template>

            <!-- 内容 -->
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <!-- 封装文章模块 -->
                <wenzhang
                  :articleList="articleList"
                  :active="active"
                ></wenzhang>
              </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <!-- popup弹出层 -->
    <div class="popup">
      <van-popup v-model="show" position="bottom" :style="{ height: '80%' }">
        <van-cell>
          <template #title>
            <div class="tit">我的频道</div>
          </template>
          <template #default>
            <van-button
              v-if="isRemove === false"
              type="danger"
              plain
              size="mini"
              @click="edit"
              :disabled="disabled"
              >编辑</van-button
            >
            <van-button v-else type="danger" plain size="mini" @click="complete"
              >完成</van-button
            >
          </template>
        </van-cell>
        <div class="myChannel">
          <van-grid>
            <van-grid-item
              @click="onGrid(item), (currIndex = index)"
              v-for="(item, index) in userNewsList"
              :key="index"
            >
              <template #text>
                <span :class="{ active: index === currIndex }">{{
                  item.name
                }}</span>
                <div class="remove" v-if="isRemove && index !== 0">
                  <img
                    src="../../../assets/error.jpg"
                    alt=""
                    @click="remove(item)"
                  />
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <!-- 频道推荐 -->
        <div class="recommended">
          <van-cell title="频道推荐" />
          <van-grid>
            <van-grid-item
              @click="ontuijian(item)"
              v-for="(item, index) in historyList"
              :key="index"
              :text="item.name"
              style="color: #000;"
            >
            </van-grid-item>
          </van-grid>
        </div>
      </van-popup>
    </div>
    <!-- <div @click="goTop">点我回到顶部</div> -->
    <transition name="van-slide-right">
      <div class="bus" v-show="isbus">
        <img
          src="../../../assets/dingbu.png"
          alt=""
          @click="goTop"
          style="width:100%;"
        />
      </div>
    </transition>
  </div>
</template>

<script>
// 导入请求
import {
  getTopNewsListApi,
  getUserNewsListApi,
  getTuiJianApi
} from '../../../api/index.js'
import { localSet, localGet } from '../../../utils/mylocal'
export default {
  name: 'index',
  // 导入组件
  components: {
    wenzhang: () => import('./comm/wenzhang')
  },
  data () {
    return {
      disabled: false,
      // 切换栏的index索引
      currIndex: 0,
      // 控制回到底部组件的状态
      isbus: false,
      // 切换标签栏的id
      active: 0,
      // 获取全部列表
      list: [],
      // 获取用户列表
      userNewsList: [],
      // 频道推荐列表
      tuiJianList: [],
      // 文章列表
      articleList: [],
      // 控制popup弹出层
      show: false,
      // 控制显示删除频道按钮
      isRemove: false,
      // 点击频道推荐产生的数组
      historyList: [],
      // 是否处于加载状态
      loading: false,
      //  是否加载完成
      finished: false,
      // 是否刷新完成
      refreshing: false
    }
  },
  created () {
    this.getTopNewsList()
    this.userNewsList = localGet('Data') || []
    if (this.userNewsList.length === 0) {
      this.getUserNewsList()
    }
    setTimeout(() => {
      this.getList()
    }, 1000)
  },
  mounted () {
    // 获取滚动条事件
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    // 删除滚动条事件
    document.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 点击标签栏
    async changeIndex () {
      const res = await getTuiJianApi({
        channel_id: this.active,
        timestamp: Date.parse(new Date()),
        with_top: 0
      })
      this.articleList = res.data.results
    },
    // 点击删除频道
    remove (item) {
      // 点击后删除当前的频道
      const results = this.userNewsList.indexOf(item)
      this.userNewsList.splice(results, 1)
      // 将删除后的列表覆盖本地数据
      localSet('Data', this.userNewsList)
      // 调用筛选方法更新列表
      this.getList()

      // 判断 当删除剩下推荐按钮就退出编辑按钮
      if (this.userNewsList.length === 1) {
        this.$toast('不能再删除了哦~~')
        this.isRemove = false
      }
    },
    // 点击完成编辑
    complete () {
      this.isRemove = false
    },
    // 点击编辑我的频道
    edit () {
      if (this.userNewsList.length === 1) {
        this.$toast('不能再删除了哦~~')
        this.isRemove = false
        this.disabled = true
        return
      }
      this.isRemove = true
    },
    // 获得经过筛选的频道列表
    getList () {
      const arr = []
      for (const k in this.list) {
        var isExist = false
        for (const j in this.userNewsList) {
          if (this.list[k].id === this.userNewsList[j].id) {
            isExist = true
            break
          }
        }
        if (!isExist) {
          arr.push(this.list[k])
        }
      }
      this.historyList = arr
    },
    // 点击频道推荐
    ontuijian (item) {
      // 点击后添加到用户的列表中
      // console.log(this.userNewsList.includes(item))
      if (!this.userNewsList.includes(item)) {
        this.userNewsList.push(item)
      }
      this.disabled = false
      this.userNewsList.indexOf(item)
      // 数组去重
      this.userNewsList = [...new Set(this.userNewsList)]
      localSet('Data', this.userNewsList)
      // 点击后删除当前的元素
      const results = this.historyList.indexOf(item)
      this.historyList.splice(results, 1)
    },
    // 点击宫格
    onGrid (item) {
      this.active = item.id
      this.onRefresh()
    },
    // 获取滚动条的位置
    handleScroll () {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.scrollTop = scrollTop
      if (scrollTop > 0) {
        this.isbus = true
      } else {
        this.isbus = false
      }
    },
    // 跳转到顶部
    goTop () {
      // window.scroll(0,0);
      const timer = setInterval(() => {
        const ispeed = Math.floor(-this.scrollTop / 10)
        document.documentElement.scrollTop = document.body.scrollTop =
          this.scrollTop + ispeed
        if (this.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 10)
    },
    onLoad () {
      this.refreshing = false
      this.getTuiJian()
      setTimeout(() => {
        this.loading = false
        if (this.articleList.length >= 40) {
          this.finished = true
        } else if (this.articleList.length === 0) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      // 清空列表数据
      // setTimeout(() => {
      this.finished = false
      this.articleList = []
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态

      this.onLoad()
      this.loading = true
      this.refreshing = false

      // }, 1000)
    },
    // 获取频道新闻推荐
    async getTuiJian () {
      const res = await getTuiJianApi({
        channel_id: this.active,
        timestamp: Date.parse(new Date()),
        with_top: 0
      })
      this.articleList.push(...res.data.results)
    },
    // 获取用户列表
    async getUserNewsList () {
      const res = await getUserNewsListApi()
      this.userNewsList = res.data.channels
    },
    // 获取全部列表
    async getTopNewsList () {
      // 获取列表
      const res = await getTopNewsListApi()
      this.list = res.data.channels
    },
    // 控制弹出层
    showPopup () {
      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
.active {
  color: red;
}
span {
  font-size: 12px;
}
.index {
  position: relative;
  padding-bottom: 70px;
  .iconf {
    i {
      font-size: 24px !important;
      color: #fff;
      font-weight: 700;
    }
  }
  .position {
    position: sticky;
    top: 0;
    z-index: 1;
    .hd {
      color: #fff;
    }
    .icon {
      position: absolute;
      right: 0;
      top: 8px;
      width: 40px;
      text-align: center;
      font-size: 24px;
      ::v-deep i.van-icon.van-icon-bars {
        color: #fff;
      }
    }
    .item {
      width: 50px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .bar {
      position: relative;
      ::v-deep .van-list__finished-text {
        height: 100px;
      }
    }
  }
  .popup {
    .tit {
      height: 100%;
      line-height: 29px;
    }
    ::v-deep .van-button--mini.van-button--plain {
      width: 50px;
      border-radius: 20px;
    }
    ::v-deep .van-grid.van-hairline--top {
      width: 100%;
    }
    .myChannel {
      // display: flex;
      .van-grid-item {
        position: relative;

        .remove {
          position: absolute;
          right: 0px;
          top: -4px;
          width: 18px;
          height: 18px;
          z-index: 1;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .bus {
    position: fixed;
    right: 0;
    bottom: 400px;
    background-color: transparent;
    width: 70px;
    height: 70px;
    z-index: 99;
  }
}
</style>
