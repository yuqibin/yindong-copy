import {
  fetch
} from "./http";

// 获取分类+关键词下的标题列表（id+title） 展示用
export const getTitleList = params => {
  return fetch.post('/apic/article/titlelist', params)
}

// id数组获取对应文章数据 数组
export const getDetailList = params => {
  return fetch.post('/apic/article/detaillist', params)
}

// 导航菜单
export const getMenuList = () => {
  return fetch.get('/apic/tags')
}

// 周热门数据
export const getWeekHot = () => {
  return fetch.get('/apic/weekhot')
}

// aid 获取作者详细信息
export const getAuthorInfo = params => {
  return fetch.post('/apic/author/info', params)
}

// 作者榜
export const getAuthorList = () => {
  return fetch.get('/apic/author/list')
}

// 获取文章  维度：  作者|''  /  关键词|''  /  分类|'' /  offset|0  /  size|10
export const getArticleList = params => {
  return fetch.post('/apic/article/aaalist', params)
}