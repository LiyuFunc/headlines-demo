import instance from '../utils/request'

// 获取搜索历史记录
export function historySearchApi (data) {
  return instance({
    url: '/v1_0/search',
    params: data,
    needToken: true
  })
}

// 获取联想建议(自动补全)
export function getSuggestionApi (data) {
  return instance({
    url: '/v1_0/suggestion',
    params: data
  })
}

// 页面详情
export function getdetailsApi ({ id }) {
  return instance({
    url: `/v1_0/articles/${id}`,
    needToken: true
  })
}

// 获取评论或发表评论
export function getCommentApi (data) {
  return instance({
    url: '/v1_0/comments',
    method: 'GET',
    params: data
  })
}

// 发布评论
export function sendCommentApi (data) {
  return instance({
    url: 'v1_0/comments',
    method: 'POST',
    data: data,
    needToken: true
  })
}

// 对文章点赞
export function likeApi (data) {
  return instance({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: data,
    needToken: true
  })
}

// 对文章取消点赞
export function outLikeApi (id) {
  return instance({
    url: `/v1_0/article/likings/${id}`,
    method: 'DELETE',
    needToken: true
  })
}

// 关注用户
export function focusApi (data) {
  return instance({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: data,
    needToken: true
  })
}

// 取消关注
export function unfollowApi (id) {
  return instance({
    url: `/v1_0/user/followings/${id}`,
    method: 'DELETE',
    needToken: true
  })
}
