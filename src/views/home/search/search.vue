<template>
  <div class="search">
    <div class="pic">
      <img src="../../../assets/头条搜索.png" alt="" />
    </div>
    <div class="searchK">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @input="inputChange"
      />
      <div class="searchBtn" @click="onSearch(value)">
        <i class="iconfont icon-sousuo"></i>
      </div>
    </div>
    <div class="history" v-if="!histStatus">
      <!-- 历史标题 -->
      <van-cell title="历史区域">
        <template #default>
          <i class="iconfont icon-shanchu myicon" @click="delHistory"></i>
        </template>
      </van-cell>
      <!-- 历史记录 -->
      <van-cell v-for="(item, index) in historyArr" :key="index">
        <template #icon>
          <i class="iconfont icon-sousuo myicon2"></i>
        </template>
        <template #title>
          <div class="historyList">
            <span @click="historyClick(item)">{{ item }}</span>
            <i
              class="iconfont icon-guanbi myicon1"
              @click="del1SingleHistory(index, item)"
            ></i>
          </div>
        </template>
        <!-- <template #default>
          <i
            class="iconfont icon-guanbi myicon1"
            @click="del1SingleHistory(index, item)"
          ></i>
        </template> -->
      </van-cell>
    </div>
    <!-- 联想区域 -->
    <div class="lenovo" v-if="histStatus">
      <van-cell title="联想区域"> </van-cell>
      <van-cell v-for="(item, index) in lenovoList" :key="index">
        <template #icon>
          <i class="iconfont icon-sousuo myicon"></i>
        </template>
        <template #title>
          <div v-html="item" @click="lenovoClick(item)"></div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { localSet, localGet, localDel } from '../../../utils/mylocal'
import { getSuggestionApi } from '../../../api/search'
export default {
  data () {
    return {
      value: '',
      // 历史记录
      historyArr: [],
      // 防抖
      timeId: '',
      // 联想区域
      lenovoList: [],
      // 历史状态判断
      histStatus: false
    }
  },
  created () {
    this.historyArr = localGet('history') || []
  },
  methods: {
    // 获取搜索框内容
    onSearch (val) {
      if (!val) {
        this.$toast.fail('搜索框内容不能为空!')
        return
      }
      this.historyArr.unshift(val)
      localSet('history', [
        ...new Set(JSON.parse(JSON.stringify(this.historyArr)))
      ])
      this.historyArr = [
        ...new Set(JSON.parse(JSON.stringify(this.historyArr)))
      ]
      this.$router.push(`/searchResult/${val}`)
      this.value = ''
    },
    // 点击取消按钮
    onCancel () {
      this.value = ''
      this.histStatus = false
    },
    // 点击删除单个历史记录
    del1SingleHistory (index) {
      this.historyArr.splice(index, 1)
      localSet('history', this.historyArr)
    },
    // 删除全部历史记录
    delHistory () {
      if (!localGet('history')) {
        this.$toast('您的历史记录已经空空思密达,不用再清空啦!')
      } else {
        this.$dialog
          .confirm({
            title: '提示',
            message: '你确定要删除历史记录吗?'
          })
          .then(() => {
            localDel('history')
            this.historyArr = []
            this.$toast('清除成功!')
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    // 点击历史记录
    historyClick (item) {
      this.value = item
      this.$router.push(`/searchResult/${item}`)
    },
    // 搜索框的联想区域
    inputChange (value) {
      if (!value) {
        this.histStatus = false
      } else {
        this.histStatus = true
        clearTimeout(this.timeId)
        this.timeId = setTimeout(async () => {
          const res = await getSuggestionApi({
            q: value
          })
          let arr = []
          let arr1 = []
          arr = res.data.options
          // arr.forEach(item => {
          //   if (item.includes(value)) {
          //     console.log(item)
          //     arr1.push(
          //       item.replace(value, `<span style="color:red">${value}</span>`)
          //     )
          //   } else {
          //     // 如果输入的是大写 就需要再进行判断
          //     if (/^[A-Z]+$/.test(value)) {
          //       // console.log('111:' + value)
          //       arr1.push(
          //         item.replace(
          //           value.toLowerCase(),
          //           `<span style="color:red">${value.toLowerCase()}</span>`
          //         )
          //       )
          //     } else {
          //       arr1.push(
          //         item.replace(
          //           new RegExp(value.toUpperCase(), 'gi'),
          //           `<span style="color:red">${value.toUpperCase()}</span>`
          //         )
          //       )
          //     }
          //   }
          // })
          arr1 = arr.map(item => {
            const reg = new RegExp(value, 'gi')
            const data = item.match(reg)
            const newData = item.replace(
              reg,
              `<span style='color:red'>${data}</span>`
            )
            return newData
          })
          this.lenovoList = arr1
        }, 500)
      }
    },
    // 联想区域点击状态
    lenovoClick (item) {
      if (item.includes('span')) {
        // console.log(item)
        item = item.split('>')
        item = item[1].split('<')[0] + item[2]
        this.value = item
        this.onSearch(item)
      } else {
        this.value = item
        this.onSearch(item)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search {
  padding: 100px 15px;
  padding-bottom: 0;
  height: 100vh;
  background-color: #f6f6f9;
  .pic {
    text-align: center;
  }
  .searchK {
    border: #414351 2px solid;
    border-radius: 10px;
    height: 40px;
    overflow: hidden;
    // padding-top: 5px;
    display: flex;
    /deep/ .van-search {
      background-color: transparent;
      padding: 0;
      width: 280px;
      height: 100%;
    }
    /deep/ .van-cell {
      width: 100%;
      height: 100%;
      padding: 0;
    }
    /deep/ .van-field__control {
      background-color: #f6f6f9;
      width: 100%;
      height: 100%;
      padding-top: 3px;
    }
    /deep/ .van-cell__value {
      background-color: #f6f6f9;
    }
    /deep/ .van-search__content {
      background-color: #f6f6f9;
    }
    .searchBtn {
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      width: 65px;
      height: 100%;
      background-color: #3d404d;
      i {
        font-size: 18px;
        color: #f6f6f9;
      }
    }
  }
  /deep/ .van-search__action:active {
    background-color: transparent;
  }
  .history {
    .historyList {
      span {
        display: inline-block;
        width: 220px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i {
        padding-left: 43px;
      }
    }
    .myicon2 {
      padding-top: 3px;
    }
    /deep/ .van-cell {
      background-color: #f6f6f9;
    }
    /deep/ .van-search__action {
      color: #fff;
    }
    /deep/ .van-cell__title {
      font-size: 14px;
    }

    .myicon {
      font-size: 16px;
    }
    .myicon1 {
      font-size: 20px;
    }
  }
  .lenovo {
    /deep/ .van-cell {
      background-color: #f6f6f9;
    }
  }
}
</style>
