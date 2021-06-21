<template>
  <div class="searchResult">
    <van-nav-bar left-arrow @click-left="onClickLeft">
      <template #title>
        <span class="title">搜索结果</span>
      </template>
    </van-nav-bar>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="(item, index) in searchList" :key="index">
            <van-cell>
              <template #title>
                <div
                  class="contentTitle"
                  @click="
                    $router.push(
                      `/detail/${$route.path.split('/')[1]}/${
                        $route.path.split('/')[2]
                      }/${item.art_id}`
                    )
                  "
                >
                  <div v-html="item.title"></div>
                </div>
              </template>
              <template #label>
                <div class="label">
                  <div class="img" v-if="item.cover.images.length > 0">
                    <img
                      v-for="(img, index) in item.cover.images"
                      :key="index"
                      :src="img"
                      alt=""
                    />
                  </div>
                  {{ item.aut_name }}
                  <span class="comment">{{ item.comm_count }}评论</span>
                  <span class="time">{{ item.pubdate | timefilter }}</span>
                </div>
              </template>
            </van-cell>
            <div class="message">
              <div class="comment">
                <i class="iconfont icon-pinglun1 myicon"></i>
                {{ item.comm_count }}评论
              </div>
              <div class="prai">
                <i class="iconfont icon-aixin myicon"></i>
                {{ item.like_count }}点赞
              </div>
              <div class="share" @click="showShare = true">
                <i class="iconfont icon-icon-test myicon"></i>
                分享
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 分享面板 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
  </div>
</template>

<script>
import { historySearchApi } from '../../api/search'
export default {
  data () {
    return {
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '二维码', icon: 'qrcode' }
        ]
      ],
      showShare: false,
      // 定义刷新列表参数
      refreshing: false,
      loading: false,
      finished: false,
      searchList: [],
      page: 1,
      per_page: 10,
      total: 0
    }
  },
  methods: {
    // 列表加载
    async onLoad () {
      // console.log(this.$route.params.key)
      const res = await historySearchApi({
        page: this.page,
        per_page: this.per_page,
        q: this.$route.params.key
      })
      this.searchList.push(...res.data.results)
      // 修改标题颜色
      this.searchList.forEach(item => {
        item.title = item.title.replace(
          new RegExp(this.$route.params.key, 'gi'),
          `<span style="color:red">${this.$route.params.key.toUpperCase()}</span>`
        )
      })
      this.page++
      this.per_page += 10
      this.total = res.data.total_count
      this.refreshing = false
      setTimeout(() => {
        this.loading = false
      }, 1000)

      if (this.searchList.length >= this.total) {
        this.finished = true
      }
    },
    // 上拉刷新
    onRefresh () {
      setTimeout(() => {
        // 清空列表数据
        this.searchList = []
        this.page = 1
        this.per_page = 10
        this.finished = false
        this.total = 0

        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true
        this.onLoad()
      }, 1000)
    },
    // 返回搜索页面
    onClickLeft () {
      this.$router.push('/search')
    }
  }
}
</script>

<style scoped lang="less">
.searchResult {
  /deep/ .van-icon-arrow-left {
    color: #fff;
  }
  /deep/.van-nav-bar__content {
    background-color: #3e9df8;
  }
  .title {
    color: #fff;
  }
  .content {
    .contentTitle {
      font-size: 14px;
      font-weight: 700;
      line-height: 3.5;
    }
    .label {
      font-size: 14px;
      color: #3e3e60;
      .comment {
        padding: 0 15px;
      }
      .img {
        display: flex;
        width: 100px;
        height: 75px;
        margin-bottom: 12px;
        img {
          width: 100px;
          height: 75px;
          margin-left: 10px;
        }
      }
    }
    .message {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 12px;
      margin-top: 10px;
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
      border-top: 1px solid #ddd;
      .myicon {
        font-size: 16px;
      }
    }
  }
}
</style>
