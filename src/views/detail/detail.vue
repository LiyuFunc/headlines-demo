<template>
  <div class="detail">
    <div class="one">
      <div class="dingwei">
        <van-nav-bar left-arrow @click-left="onClickLeft">
          <template #title>
            <span class="topTitle">文章详情</span>
          </template>
          <template #right>
            <div class="rigth">
              <div class="fnd">
                <img :src="detailList.aut_photo" alt="" />
                <span v-if="!detailList.is_followed" @click="focus">+关注</span>
                <span v-if="detailList.is_followed" @click="unfollow"
                  >已关注</span
                >
              </div>
            </div>
          </template>
        </van-nav-bar>
      </div>
      <div class="content">
        <div class="title">
          {{ detailList.title }}
        </div>
        <van-cell>
          <template #title>
            <div class="zong">
              <div class="userInfo">
                <div class="img">
                  <img :src="detailList.aut_photo" alt="" />
                </div>
                <div class="user">
                  <div>
                    {{ detailList.aut_name }}
                  </div>
                  <div>
                    {{ detailList.pubdate | timefilter }}
                  </div>
                </div>
              </div>
              <div class="Focus">
                <div v-if="!detailList.is_followed">
                  <van-button type="info" @click="focus">+关注</van-button>
                </div>
                <div v-else>
                  <van-button type="primary" @click="unfollow"
                    >已关注</van-button
                  >
                </div>
              </div>
            </div>
          </template>
        </van-cell>
        <div class="center">
          <div v-html="detailList.content" style="white-space: pre-wrap;"></div>
        </div>
        <div class="like">
          <div
            :class="{ active: detailList.attitude === 1 }"
            @click="likeClick"
          >
            <i class="iconfont icon-shoucangqiehuan"></i>点赞
          </div>
          <div><i class="iconfont icon-shanchu"></i>不喜欢</div>
        </div>
      </div>
      <!-- 评论列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 评论信息 -->
        <div class="comment" v-for="(item, index) in commentList" :key="index">
          <div class="account">
            <div class="pic">
              <div class="two">
                <img :src="item.aut_photo" alt="" />
                <div class="num">
                  <div class="username">{{ item.aut_name }}</div>
                  <div class="commentContent">{{ item.content }}</div>
                </div>
              </div>
              <div
                class="pari"
                :class="{ active: likeComment === 1 && num === index }"
                @click="pariClik(index)"
              >
                <i class="iconfont icon-shoucangqiehuan"></i>
                {{ item.like_count }}
              </div>
            </div>
            <div class="commentNum">
              <div class="time">{{ item.pubdate | timefilter }}</div>
              <div class="reply" @click="replyClick(item, index)">
                回复 {{ item.reply_count }}
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <!-- 回复评论 -->
    </div>
    <!-- 回复评论弹窗 -->
    <div class="footer1">
      <van-popup v-model="show" position="bottom" :style="{ height: '60%' }">
        <div class="popup" v-if="commentList[commentIndex]">
          <div class="title">
            <van-cell>当前评论</van-cell>
          </div>
          <div class="pic">
            <div class="two">
              <img :src="commentList[commentIndex].aut_photo" alt="" />
              <div class="num">
                <div class="username">
                  {{ commentList[commentIndex].aut_name }}
                </div>
                <div class="commentContent">
                  {{ commentList[commentIndex].content }}
                </div>
              </div>
            </div>
            <div class="pari" :class="{ active: likeComment === 1 }">
              <i class="iconfont icon-shoucangqiehuan"></i>
              {{ commentList[commentIndex].like_count }}
            </div>
          </div>
          <div class="commentNum">
            <div class="time">
              {{ commentList[commentIndex].pubdate | timefilter }}
            </div>
          </div>
        </div>
        <van-cell>评论的回复</van-cell>
        <div class="therr" v-for="(item, index) in replyList" :key="index">
          <div class="pic">
            <div class="two">
              <img :src="item.aut_photo" alt="" />
              <div class="num">
                <div class="username">{{ item.aut_name }}</div>
                <div class="commentContent">{{ item.content }}</div>
              </div>
            </div>
            <div class="pari">
              <i class="iconfont icon-shoucangqiehuan"></i>
              {{ item.like_count }}
            </div>
          </div>
          <div class="commentNum">
            <div class="time">{{ item.pubdate | timefilter }}</div>
          </div>
        </div>
        <div class="footer" v-if="!footerShow">
          没有更多了
        </div>
        <!-- 回复框的底部回复 -->
        <div class="fixed" v-if="show">
          <div class="input">
            <input
              type="text"
              class="inputValue"
              placeholder="写评论"
              v-model="replyComment"
              @keyup.enter="replyCommentA"
            />
          </div>
          <div class="btn">
            <van-button type="primary" @click="replyCommentA">发送</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <!-- 评论内容 -->
    <div class="fixed" v-if="!show">
      <div class="input">
        <input
          type="text"
          class="inputValue"
          placeholder="写评论"
          v-model="comValue"
          @keyup.enter="send"
        />
      </div>
      <div class="btn">
        <van-button type="primary" @click="send">发送</van-button>
      </div>
    </div>
    <div class="footer" v-if="!footerShow">
      没有更多了
    </div>
  </div>
</template>

<script>
import {
  getdetailsApi,
  getCommentApi,
  sendCommentApi,
  likeApi,
  focusApi
  // outLikeApi
} from '../../api/search'
export default {
  data () {
    return {
      id: this.$route.params.artid,
      // 文章渲染
      detailList: {},
      // List加载列表
      loading: false,
      finished: false,
      // 评论列表
      commentList: [],
      // 评论总数
      total: 0,
      // 评论的offset参数  评论结束id
      end_id: 0,
      // 评论的offset参数  评论开始id
      last_id: 0,
      // 评论显示条数
      limit: 10,
      // 弹出层
      show: false,
      // 底部显示没有更多了
      footerShow: false,
      // 评论内容
      comValue: '',
      // 评论下标
      commentIndex: 0,
      // 回复评论列表
      replyList: [],
      // 回复评论
      replyComment: '',
      // 评论id
      com_id: [],
      // 评论点赞
      likeComment: 0,
      num: 0
    }
  },
  created () {
    this.getdetails()
  },
  methods: {
    // 关注用户
    async focus () {
      await focusApi({
        target: this.detailList.aut_id
      })
      this.$toast.loading('关注中...')
      this.detailList.is_followed = true
      if (this.detailList.is_followed) {
        this.$toast.success('已关注!')
      }
    },
    // 取消关注
    async unfollow () {
      // await unfollowApi({
      //   target: this.detailList.aut_id
      // })
      this.detailList.is_followed = false
      this.$toast.success('取消成功')
    },
    // 评论点赞
    pariClik (index) {
      if (this.likeComment === 0) {
        this.likeComment = 1
        this.num = index
        this.commentList[index].like_count += 1
      } else {
        this.likeComment = 0
        this.num = index
        this.commentList[index].like_count -= 1
      }
    },
    // 文章点赞
    async likeClick () {
      if (this.detailList.attitude !== 1) {
        this.$toast.loading('加载中...')
        await likeApi({
          target: this.$route.params.artid
        })
        this.detailList.attitude = 1
        this.$toast('点赞成功!')
      } else {
        // 接口没用
        // await outLikeApi({
        //   target: this.$route.params.artid
        // })
        this.detailList.attitude = 0
        this.$toast('取消成功')
      }
    },
    // 发表回复评论
    async replyCommentA () {
      const res = await sendCommentApi({
        target: this.com_id,
        content: this.replyComment,
        art_id: this.$route.params.artid
      })
      this.replyList.unshift(res.data.new_obj)
      // console.log(res)
      this.replyComment = ''
      this.$toast.success('回复成功,评论正在审核!')
    },
    // 点击回复
    async replyClick (item, index) {
      this.show = true
      this.com_id = item.com_id
      // 获取offset参数
      const res = await getCommentApi({
        type: 'c',
        source: this.com_id.toString(),
        limit: this.limit
      })
      // console.log(res)
      this.replyList = res.data.results
      this.commentIndex = index
    },
    // 返回主页
    onClickLeft () {
      if (this.$route.params.path) {
        this.$router.push(
          `/${this.$route.params.path}/${this.$route.params.key}`
        )
      } else {
        this.$router.push('/index')
      }
    },
    // 获取文章详情
    async getdetails () {
      const res = await getdetailsApi({
        id: this.$route.params.artid
      })
      this.detailList = res.data
      const res1 = await getCommentApi({
        type: 'a',
        source: this.$route.params.artid,
        limit: this.limit
      })
      this.last_id = res1.data.last_id
      this.commentList = res1.data.results
    },
    // onLoad下拉刷新列表  获取评论列表
    async onLoad () {
      if (this.last_id !== null) {
        this.footerShow = true
        setTimeout(async () => {
          const res = await getCommentApi({
            type: 'a',
            source: this.$route.params.artid,
            offset: this.last_id,
            limit: this.limit
          })
          this.total = res.data.total_count
          this.last_id = res.data.last_id
          this.commentList.unshift(...res.data.results)

          this.loading = false
          if (this.commentList.length >= this.total) {
            this.finished = true
          }
        }, 1000)
      } else {
        this.loading = false
        this.footerShow = false
      }
    },
    // 发送评论
    async send () {
      if (this.comValue !== '') {
        const res = await sendCommentApi({
          target: this.id,
          content: this.comValue
        })
        this.commentList.unshift(res.data.new_obj)
        this.comValue = ''
        this.$toast.success('发表成功!')
      } else {
        this.$toast('评论内容不能为空!')
      }
    }
  }
}
</script>

<style scoped lang="less">
.active {
  color: red;
}
.detail {
  padding-bottom: 20px;
  .one {
    .dingwei {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 99999999;
    }
    /deep/ .van-icon-arrow-left {
      color: #fff;
    }
    /deep/.van-nav-bar__content {
      background-color: #3e9df8;
    }
    .topTitle {
      color: #fff;
    }
    .rigth {
      .fnd {
        background: rgba(255, 255, 255, 0.3) !important;
        padding: 2px 10px;
        border-radius: 20px;
        img {
          // opacity: 0.3;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          vertical-align: middle;
          opacity: 1;
        }
        span {
          color: #494a69;
        }
      }
    }
    .content {
      padding: 15px;
      margin-top: 30px;
      overflow: hidden;
      .title {
        margin-bottom: 20px;
      }
      .zong {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .userInfo {
          display: flex;
          align-items: center;
          .img {
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 5px;
              vertical-align: middle;
            }
          }
          .user {
            font-size: 13px;
            color: #3a343c;
          }
        }
        .Focus {
        }
      }
      .center {
        word-break: break-all; /*支持IE，chrome，FF不支持*/
        word-wrap: break-word; /*支持IE，chrome，FF*/
        // margin-top: 20px;
        padding: 20px;
        border-bottom: 1px solid #f9f9fa;
        overflow: hidden;
        div {
          font-size: 16px;
          word-break: break-all; /*支持IE，chrome，FF不支持*/
          word-wrap: break-word; /*支持IE，chrome，FF*/
          white-space: pre-wrap;
          /deep/ code {
            word-break: break-all; /*支持IE，chrome，FF不支持*/
            word-wrap: break-word; /*支持IE，chrome，FF*/
            white-space: pre-wrap;
          }
          /deep/ img {
            width: 100%;
          }
        }
      }
      .like {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: space-evenly;
        padding: 20px 0;
        font-size: 12px;
        div {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 30px;
        }
      }
    }
    .comment {
      padding: 15px;
      .account {
        .pic {
          display: flex;
          font-size: 16px;
          justify-content: space-between;
          align-items: center;
          .two {
            display: flex;
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
            }
            .num {
              margin-top: 5px;
              .username {
                font-size: 14px;
              }
              .commentContent {
                padding: 10px 0;
              }
            }
          }
          .pari {
          }
        }
        .commentNum {
          display: flex;
          margin-left: 50px;
          font-size: 14px;
          .time {
            padding: 5px 8px;
            padding-left: 0;
            color: #bbb;
          }
          .reply {
            background-color: #cccccc;
            margin-left: 15px;
            padding: 5px 8px;
            border-radius: 20px;
          }
        }
      }
    }
  }
  .footer {
    font-size: 14px;
    color: #ccc;
    text-align: center;
    margin-bottom: 100px;
  }
  .fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9999;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: #fff;
    .input {
      .inputValue {
        width: 260px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 30px;
        padding-left: 10px;
        font-size: 16px;
      }
      ::-webkit-input-placeholder {
        color: #ccc;
        font-size: 14px;
        line-height: 30px;
        margin-bottom: 5px;
      }
    }
    .btn {
      box-sizing: border-box;
      margin-left: 8px;
      /deep/ .van-button--primary {
        // width: 50px;
        height: 28px;
        font-size: 12px;
      }
    }
  }
  .footer1 {
    padding-bottom: 30px;
    .pic {
      display: flex;
      font-size: 16px;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      padding-bottom: 0;
      box-sizing: border-box;
      .two {
        display: flex;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .num {
          margin-top: 5px;
          .username {
            color: #b0deee;
            font-size: 15px;
          }
          .commentContent {
            padding: 10px 0;
            font-size: 14px;
          }
        }
      }
      .fixed {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 9999;
        padding: 8px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        background-color: #fff;
        .input {
          .inputValue {
            width: 260px;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 30px;
            padding-left: 10px;
          }
          ::-webkit-input-placeholder {
            color: #ccc;
            font-size: 14px;
            line-height: 30px;
            margin-bottom: 5px;
          }
        }
        .btn {
          box-sizing: border-box;
          margin-left: 8px;
          /deep/ .van-button--primary {
            // width: 50px;
            height: 28px;
            font-size: 12px;
          }
        }
      }
    }
    .commentNum {
      display: flex;
      margin-left: 65px;
      font-size: 14px;
      .time {
        padding: 5px 8px;
        padding-left: 0;
        color: #bbb;
      }
    }
    .popup {
      .title {
      }
      .pari {
      }
    }
  }
}
</style>
