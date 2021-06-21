<template>
  <div class="wenzhang">
    <div class="contentList" v-for="(item, index) in articleList" :key="index">
      <div @click="$router.push('/detail/' + item.art_id)">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="content" v-if="item.cover && item.cover.images">
          <div v-for="(value, key) in item.cover.images" :key="key">
            <van-image width="100" height="100" :src="value">
              <template #error>
                <img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.dangrixiu.cn%2Fpublic%2Fupload%2Ftemp%2F2019%2F05-23%2Fa211a3acb907256b00f48d3d09ce1d67.gif&refer=http%3A%2F%2Fwww.dangrixiu.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621740813&t=070b2db0b9ef18f97b57330ebd3ec507"
                  alt=""
                />
              </template>
            </van-image>
          </div>
        </div>
      </div>
      <div class="bottom">
        <span>{{ item.aut_name }}</span
        ><span> {{ item.comm_count }}评论</span
        ><span> {{ item.pubdate | timefilter }}</span>
        <i class="iconfont icon-guanbi" @click="openPop(item)"></i>
      </div>
    </div>

    <!-- 点击文章不喜欢按钮弹出popup层 -->
    <van-popup v-model="noLike" @close="close">
      <div class="cell">
        <van-cell-group v-if="link === false">
          <van-cell
            size="large"
            title="不感兴趣"
            @click="buxihuan"
            icon="bill-o"
          />
          <van-cell
            size="large"
            title="反馈垃圾内容"
            icon="warn-o"
            is-link
            @click="link = true"
          />
          <van-cell
            size="large"
            title="拉黑作者"
            icon="delete-o"
            @click="lahei"
          />
        </van-cell-group>
        <van-cell-group v-else>
          <van-cell size="large" @click="link = false">
            <template #title>
              <i class="iconfont icon-arrow-left-bold"></i>
            </template>
          </van-cell>
          <van-cell
            size="large"
            v-for="(value, key) in typeObj"
            :key="key"
            @click="reportArticle(key)"
          >
            <template #title>
              <div>{{ value }}</div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  blockUserApi,
  noLikeArticleApi,
  reportArticleApi
} from '../../../../api/article'
export default {
  data () {
    return {
      // 点击不喜欢按钮存入的文章信息数据
      myArticle: '',
      // 文章违规类型
      typeObj: {
        0: '其他问题',
        1: '标题夸张',
        2: '低俗涩情',
        3: '错别字多',
        4: '旧闻重复',
        5: '广告软文',
        6: '内容不实',
        7: '涉嫌违法犯罪',
        8: '侵权'
      },
      // 跳转到反馈内容的后续
      link: false,
      // 控制不喜欢按钮弹出层
      noLike: false
    }
  },
  props: ['articleList', 'active'],
  methods: {
    // 举报文章
    async reportArticle (key) {
      const res = await reportArticleApi({
        target: this.myArticle.art_id,
        type: +key
      })
      if (res.message === 'OK') {
        this.$toast.success('举报成功~')
        // 删除不喜欢的文章
        const num = this.articleList.indexOf(this.myArticle)
        this.articleList.splice(num, 1)
        this.noLike = false
      }
    },
    // 对文章不喜欢
    async buxihuan () {
      this.$toast.loading('请稍后...')
      const res = await noLikeArticleApi({
        target: this.myArticle.art_id
      })
      if (res.message === 'OK') {
        this.$toast.success('操作成功~')
        // 删除不喜欢的文章
        const num = this.articleList.indexOf(this.myArticle)
        this.articleList.splice(num, 1)
        this.noLike = false
      }
    },
    // 拉黑
    async lahei () {
      this.$toast.loading('请稍后...')
      const res = await blockUserApi({
        target: this.myArticle.aut_id
      })
      if (res.message === 'OK') {
        this.$toast.success('拉黑成功,请刷新页面~')
        this.noLike = false
      }
    },
    // 点击不喜欢处理
    openPop (item) {
      this.noLike = true
      this.myArticle = item
    },
    // 关闭弹出层时的逻辑处理
    close () {
      this.link = false
    }
  }
}
</script>
<style lang="less" scoped>
.cell {
  width: 340px;
}
.active {
  color: red;
}
span {
  font-size: 12px;
}
.wenzhang {
  padding: 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  .contentList {
    .title {
      color: #000;
      font-size: 14px;
      margin: 18px 0;
      font-weight: 700;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .content {
      display: flex;
      justify-content: space-between;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .bottom {
      position: relative;
      span {
        font-size: 12px;
        color: #b4b4b4;
        margin-right: 10px;
      }
      .iconfont {
        position: absolute;
        right: 0;
        top: 4px;
        color: #a8a7a7;
        font-size: 24px;
      }
    }
  }
}
</style>
