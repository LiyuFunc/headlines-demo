import instance from '../utils/request.js'

// 得到验证码的请求
export function getLogineApi (data) {
  return instance({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: data
  })
}
