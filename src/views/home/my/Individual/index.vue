<template>
  <div class="lndividual" v-if="myLi.data">
    <!-- 个人信息头部 -->

    <van-nav-bar right- left-arrow class="tou">
      <template #right>
        <div @click="onClickRight" class="mytou">保存</div>
      </template>
      <template #title>
        <div class="mytouI">个人信息</div>
      </template>
      <template #left>
        <van-icon
          size="25"
          name="arrow-left"
          class="mytou"
          @click="onClickLeft"
        />
      </template>
    </van-nav-bar>

    <!-- 列表 -->
    <div class="myLi">
      <van-cell is-link title="头像" @click="goPicture">
        <template #default>
          <div>
            <img :src="tu" alt="" />
          </div>
        </template>
      </van-cell>
      <van-cell size="25" is-link title="昵称" @click="myname">
        <template #default>{{ name }}</template>
      </van-cell>
      <van-cell size="25" is-link title="介绍">
        <template #default>{{ myLi.data.intro }}</template>
      </van-cell>
      <van-cell size="25" is-link title="性别" @click="mygender">
        <template #default>{{ Gender[gender] }}</template>
      </van-cell>
      <van-cell size="25" is-link title="生日">
        <template #default>{{ myLi.data.birthday }}</template>
      </van-cell>
    </div>
    <!--  修改名字 -->
    <van-popup v-model="nameShow" position="bottom" @closed="Goname">
      <van-cell-group>
        <van-field v-model="name" />
      </van-cell-group>
    </van-popup>
    <!-- 修改性别 -->
    <van-popup v-model="gendershow" position="bottom">
      <van-picker
        title="选择性别"
        show-toolbar
        ref="chooseFile"
        @confirm="onConfirm"
        :columns="Gender"
        :default-index="gender"
      />
    </van-popup>
    <van-uploader ref="tup" :after-read="afterRead">
      <van-popup class="tankuang" v-model="PictureShow">
        <van-button size="large" type="default" @click="choose">
          从相册中选择
          <!-- <template #preview-cover>
            <div class="preview-cover van-ellipsis"></div>
          </template> -->
        </van-button>

        <!-- <van-uploader :after-read="afterRead" /> -->
        <van-button type="default" size="large" @click="quexiao"
          >拍照</van-button
        >
        <van-button type="default" size="large" @click="PictureShow = false"
          >取消</van-button
        >
      </van-popup>
    </van-uploader>
    <!-- <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block" />

      </div>
    </van-overlay> -->
  </div>
</template>
<script>
import { Toast, ImagePreview } from 'vant'
// 导入请求接口
import { grtLndividual, getPhotoApi, patchPhoto } from '@/api/my.js'
// 调用vuex
// import { mapState } from 'vuex'
// import { Dialog } from 'vant'
export default {
  data () {
    return {
      // 创建一个值存放方法返回的页面数据
      myLi: '',
      PictureShow: false,
      // 照片显示
      nameShow: false,
      // 名字
      name: '',
      // 性别
      Gender: ['男', '女'],
      // 性别序号
      gender: '',
      // 显示性别
      gendershow: false,
      zhaopianshow: false,
      // 存放照片
      fileList: [],
      // 图片
      tu: '',
      show: false,
      img: '',
      // 图片上传
      forbidClick: false
    }
  },
  // 生命周期
  created () {
    this.getMy()
  },
  methods: {
    // 性别选择
    onConfirm (value, index) {
      console.log(value)
      this.gender = index
      console.log(this.gender)
      this.gendershow = false
    },
    // 显示性别
    mygender () {
      this.gendershow = true
    },
    // 退出修改名字弹框时执行
    async Goname () {},
    // 修改名字
    myname () {
      this.nameShow = true
    },
    // 返回按钮
    onClickLeft () {
      console.log('返回')
      this.$router.push('/my')
    },
    // 获取页面数据
    async getMy () {
      const res = await grtLndividual()
      this.myLi = res
      this.tu = res.data.photo
      this.name = res.data.name
      this.gender = res.data.gender
      // this.fileList.push(res.data.photo)
      // this.fileList = this.tu
      // console.log(this.myLi)
    },
    // 弹出头像上传选项
    goPicture () {
      this.PictureShow = true
    },
    // 拍照按钮
    quexiao () {
      console.log('拍个照')
      console.log(this.fileList)
    },
    // ---------------------------------------------
    // // 上传图片
    async afterRead (file) {
      // 此时可以自行将文件上传至服务器
      // var photo = file.content.split(',')[1]
      var img = URL.createObjectURL(file.file)
      // 图片预览
      ImagePreview(
        {
          images: [img],
          closeable: true
        },
        (this.forbidClick = false)
      )
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const res = await getPhotoApi(file.file)
      console.log(res)
      if (res.message === 'OK') {
        setTimeout(() => {
          Toast.success('头像修改成功')
        }, 1000)
      } else {
        Toast.fail('头像修改失败')
      }
      this.tu = res.data.photo
    },
    // 保存按钮
    async onClickRight () {
      console.log(this.name)
      const res = await patchPhoto({
        name: this.name
      })
      console.log(res)
      console.log(res.message)
      console.log('保存')
      if (res.message === 'OK') {
        Toast.success('修改成功')
      } else {
        Toast.fail('修改失败')
      }
    },
    // 弹出本地头像上传
    choose () {
      this.PictureShow = false
      this.zhaopianshow = true
      // this.show = true
      this.$refs.tup.chooseFile()
    }
  }
}
</script>
<style lang="less" scoped>
.lndividual {
  margin: 0;
  padding: 0;
  .tou {
    background-color: #3d404d;
    .mytou {
      color: #fff;
    }
    .mytouI {
      color: #fff;
      font-weight: 600;
    }
  }
  .myLi {
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #ffffff;
      margin-right: 8px;
    }
  }
  .tankuang {
    border-radius: 10px;
    width: 300px;
    height: 170px;
    /deep/ .van-overlay {
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .block {
          width: 120px;
          height: 120px;
          background-color: #fff;
        }
      }
    }
  }
  .zhaopian {
    height: 230px;
    width: 250px;
    /deep/ .van-uploader__upload {
      width: 100%;
      height: 241px;
    }
    /deep/ .van-uploader__preview-image {
      width: 250px;
      height: 230px;
    }
  }
}
</style>
