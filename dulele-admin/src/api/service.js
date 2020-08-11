import {
  fetch
} from './http';

// 获取七牛云上传凭证
export const getQiniuToken = params => {
  return fetch.get('/api/qiniutoken', params)
}

// 登录
export const adminLogin = params => {
  return fetch.post('/api/user/login', params)
}

// 获取用户基础信息 姓名 头像icon 签名
export const getUserInfo = params => {
  return fetch.get('/api/user/userinfo', params)
}

// 获取菜单列表（标签列表）
export const getMenuList = params => {
  return fetch.get('/api/tags', params)
}

// 获取文章列表(自己的)
export const getArticleList = params => {
  return fetch.post('/api/article/list', params)
}

// 新增文章
export const addArticle = params => {
  return fetch.post('/api/article/new', params)
}

// 更新文章
export const updateArticle = params => {
  return fetch.post('/api/article/update', params)
}

// 删除文章
export const delArticle = params => {
  return fetch.post('/api/article/del', params)
}

// 获取文章详情
export const getArticleDetail = params => {
  return fetch.post('/api/article/detail', params)
}

// 更换头像
export const updateHeadPic = params => {
  return fetch.post('/api/user/updateheadpic', params)
}

// 超管获取邀请码列表
export const getInvCodeList = () => {
  return fetch.get('/api/user/superadmin/getinvitationcode')
}

// 超管验证
export const isSuperAdmin = () => {
  return fetch.get('/api/user/issuperadmin')
}

// 新增邀请码
export const addNewCode = () => {
  return fetch.get('/api/user/superadmin/generatecode')
}

// 判断管理员是否登录
export const isAdmin = () => {
  return fetch.get('/api/user/isadmin')
}

export const register = params => {
  return fetch.post('/api/user/register', params)
}

export default {
  adminLogin
}