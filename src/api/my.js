import instance from '../utils/request.js'
// 我的页面个人信息
export function getMy () {
  return instance({
    url: '/v1_0/user',
    needToken: true
  })
}
// 进入编辑个人信息页面1
export function grtLndividual (data) {
  return instance({
    url: '/v1_0/user/profile',
    needToken: true,
    data: data
  })
}
// 保存信息
export function patchPhoto (data) {
  return instance({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: data,
    needToken: true
  })
}
// 修改头像接口
export function getPhotoApi (data) {
  const fd = new FormData()
  fd.append('photo', data)
  return instance({
    url: '/v1_0/user/photo',
    needToken: true,
    method: 'PATCH',
    data: fd
  })
}
