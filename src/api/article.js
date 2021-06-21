import instance from '../utils/request.js'

// 对文章不喜欢
export function noLikeArticleApi (data) {
  return instance({
    url: '/v1_0/article/dislikes',
    method: 'post',
    data: data,
    needToken: true
  })
}

// 拉黑用户
export function blockUserApi (data) {
  return instance({
    url: '/v1_0/user/blacklists',
    method: 'post',
    data: data,
    needToken: true
  })
}

// 举报文章
export function reportArticleApi (data) {
  return instance({
    url: '/v1_0/article/reports',
    method: 'post',
    data: data,
    needToken: true
  })
}
