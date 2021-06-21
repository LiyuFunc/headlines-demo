import instance from '../utils/request.js'

// 得到全部列表
export function getTopNewsListApi () {
  return instance({
    url: '/v1_0/channels'
  })
}

// 得到用户频道列表
export function getUserNewsListApi () {
  return instance({
    url: '/v1_0/user/channels',
    needToken: true
  })
}

// 新闻推荐
export function getTuiJianApi (data) {
  return instance({
    url: '/v1_1/articles',
    params: data
  })
}
