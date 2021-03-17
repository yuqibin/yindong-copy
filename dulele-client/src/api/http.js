/*
 * 基础通信组件
 * @Author: mikey.yuqibin
 * @Date: 2019-06-14 11:31:06
 * @Last Modified by: mikey.yuqibin
 * @Last Modified time: 2021-03-16 18:27:35
 */
import axios from 'axios'
import {
  splicingUrl
} from '@/common/utils/utils'

console.log(process.env.VUE_APP_BASEURL, '??')

const requestAxios = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  timeout: 10000,
  withCredentials: true,
  crossDomain: true
})

requestAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

/**
 * 基础请求方法
 * axios.get()方法 限定长度 以需要兼容的IE为标准 长度不能超过2083字节 超过则用post方法
 * @param requestType  请求类型
 * @param url：        接口地址
 * @param params：     请求参数
 * @returns {Promise}  返回一个Promise对象
 * */
async function baseRequest(requestType, url, params) {
  if (requestType === 'get') {
    return requestAxios.get(splicingUrl(url, params || {}))
  } else {
    return requestAxios({
      method: 'post',
      url: url,
      data: params || {},
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    })
  }
}
/**
 * 请求拦截
 */
requestAxios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

/**
 * 响应拦截
 */
requestAxios.interceptors.response.use(res => {
  return res
}, err => {
  return Promise.reject(err)
})

export const fetch = {
  get: (url, params) => {
    return baseRequest('get', url, params)
  },
  post: (url, params) => {
    return baseRequest('post', url, params)
  }
}