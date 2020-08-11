/*
 * 常用方法库（公有）
 * @Author: mikey.yuqibin
 * @Date: 2019-06-13 09:32:56
 * @Last Modified by: mikey.yuqibin
 * @Last Modified time: 2020-07-21 14:46:45
 */

/**
 * 拼装url
 * @param {String} url：基础url
 * @param {Object} params：要拼进url的参数对象
 * @return {String}
 * */
export const splicingUrl = (url, params) => {
  params = params || {}

  if (JSON.stringify(params) === '{}') {
    return url
  }

  if (!url.indexOf('/')) {
    url = '/' + url
  }

  if (url.indexOf('?') < 0) {
    url += '?'
  }
  for (let i in params) {
    if (typeof params[i] !== 'function') {
      url += `&${i}=${params[i]}`
    }
  }
  return url.replace('?&', '?')
}

/**
 * 获取url指定参数
 * @param {String} url: 目标url
 * @param {String} keyName: 需要从url获取到的参数key
 * @return {String} string || null
 * */
export const getUrlOneParam = (url, keyName) => {
  let reg = new RegExp('(^|&)' + keyName + '=([^&]*)(&|$)')
  let r = url.search.substr(1).match(reg)
  if (r !== null) return decodeURIComponent(r[2])
  return null
}

/**
 * 获取url全部参数
 * @param {String} url:目标url
 * @return {Object} 全部参数对象
 * */
export const getUrlAllParams = (url) => {
  let qs = (url.search.length > 0 ? url.search.substring(1) : '')
  let args = {}
  let items = qs.length > 0 ? qs.split('&') : []
  for (let data of items) {
    let item = data.split('=')
    let name = decodeURIComponent(item[0])
    let value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  return args
}

/**
 * 三非判断，（非空字符串、非null，非undefined）
 * @param {any} target:需要判断的值
 * @return boolean
 * */
export const checkThreeType = (target) => {
  if (target !== '' && target !== null && target !== undefined) {
    return true
  }
  return false
}

/**
 * 非空对象
 * @param {Object} target
 * @return {Boolean} 空对象：true 非空对象：false
 */
export const nonEmptyObject = (target) => {
  if (JSON.stringify(target) === '{}') {
    return true
  }
  return false
}

/**
 * 接口数据过滤
 * @param {Object} data: 数据（格式：非空对象）
 * @param {Array} keyLists 要保留字段名的集合
 * @return {Object} result 数据（对象）
 * */
export const DataFiltering = (data, keyLists) => {
  if (JSON.stringify(data) === '{}' || !(keyLists instanceof Array) || !keyLists.length) {
    throwError('TypeError', '参数类型错误', 'DataFiltering')
  }
  let result = {}
  for (let val of keyLists) {
    // eslint-disable-next-line no-prototype-builtins
    if (checkThreeType(val) && data.hasOwnProperty(val)) {
      result[val] = data[val]
    }
  }
  return result
}

/**
 * 抛错
 * @param {String} errorType: 错误类型--可选值:SyntaxError(语法)/ReferenceError(引用)/RangeError(范围)/TypeError(类型)/URLError(URL错误)/EvalError(eval错误)
 * @param {String} errortips: 提示内容(string)
 * @param {String} funcName: 提示错误出现在哪个方法
 * */
const throwError = function (errorType, errortips, funcName) {
  let tips = `Uncaught(in ${funcName})${errortips}`
  switch (errorType) {
    case 'SyntaxError':
      throw new SyntaxError(tips)
    case 'ReferenceError':
      throw new ReferenceError(tips)
    case 'RangeError':
      throw new RangeError(tips)
      // case 'TypeError':
      //   throw new SyntTypeErroraxError(tips)
      // case 'URLError':
      //   throw new URLError(tips)
    case 'EvalError':
      throw new EvalError(tips)
    default:
      throw new Error(tips)
  }
}

/**
 * js双精度计算保留x位小数
 * @param {String} calcuType 计算类型--add/reduce/ride/except  加减乘除
 * @param {String} decPlace 保留小数位
 * @param {Number} operaNum 操作数字
 * @param {Number} operatedNum 被操作数字
 * */
export const addDoublePrecision = (operaNum, operatedNum, calcuType, decPlace) => {
  if (typeof operaNum !== 'number' || typeof operatedNum !== 'number' || typeof calcuType !== 'string') {
    throwError('TypeError', '参数类型错误', 'addDoublePrecision')
  }
  // 去ab的最大小数位
  let result
  let pow
  if (decPlace) {
    pow = Math.pow(10, decPlace)
    // 10的x倍数
    operaNum = operaNum.toFixed(decPlace)
    operatedNum = operatedNum.toFixed(decPlace)
  } else if (decPlace === 0) {
    pow = 1
  } else {
    let operaArr = operaNum.toString().split('.')
    let operatedArr = operatedNum.toString().split('.')
    let numMaxDec = Math.max(operaArr[1] ? operaArr[1].toString().length : 0, operatedArr[1] ? operatedArr[1].toString().length : 0)
    pow = Math.pow(10, numMaxDec)
    decPlace = numMaxDec
  }
  let pOperaNum = operaNum * pow
  let pOperatedNum = operatedNum * pow
  switch (calcuType) {
    case 'add':
      result = (pOperaNum + pOperatedNum) / pow
      break
    case 'reduce':
      result = (pOperaNum - pOperatedNum) / pow
      break
    case 'ride':
      result = (pOperaNum * pOperatedNum) / (pow * pow)
      break
    case 'except':
      result = (operaNum / operatedNum).toFixed(decPlace)
      break
    default:
      throwError('RangeError', '计算类型参数错误', 'addDoublePrecision')
      break
  }
  return result
}

/**
 * 格式化日期
 * @param {Number | String} dateMsec 时间
 * @param {String} fmt 时间格式，例如： yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (dateMsec, fmt) => {
  let date = new Date(dateMsec)
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 调用浏览器复制功能
 * @param {String} str
 * @return {Boolean} true 复制成功  false 失败
 */
export const copyStr = str => {
  if (typeof str !== 'string') {
    return false
  }
  let oInput = document.createElement('input')
  oInput.value = str
  document.body.appendChild(oInput)
  try {
    oInput.select()
    if (typeof document.execCommand === 'function') {
      document.execCommand('Copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      return true
    }
    return false
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 递归实现深拷贝
 * @param {Object | Array} obj
 */
export const deepClone = obj => {
  let result = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = deepClone(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
    }
  }
  return result
}

/**
 * JSON实现深拷贝
 * 缺点：不能识别undefined、symbol、function
 * @param {Object} obj
 */
export const jsonDeepClone = obj => {
  if (obj && typeof obj === 'object') {
    return JSON.parse(JSON.stringify(obj))
  }
}
/**
 * 判断IE版本
 * 返回false说明非IE浏览器
 */
export const checkIEVersion = () => {
  let userAgent = navigator.userAgent
  let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
  if (isIE) {
    let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    return parseFloat(RegExp['$1'])
  }
  return false
}

/**
 * 根据时间获取当前小时分钟，比如： 12:25 
 * @param {Date || String} 时间对象或者时间戳 
 */
export const getHourAndMin = (time) => {
  if (typeof time === 'string') {
    time = time.split('-').join('/')
  }
  time = new Date(time)
  let h = time.getHours()
  let m = time.getMinutes()
  h = h < 10 ? `0${h}` : h
  m = m < 10 ? `0${m}` : m
  return `${h}:${m}`
}

/**
 * 根据时间获取月:日 格式数据
 * @param {Date} date
 */

export const getMonthAndDay = (date) => {
  if (typeof time === 'string') {
    date = date.split('-').join('/')
  }
  date = new Date(date)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 根据两个时间计算时间差，返回一个对象，x年x月x日x时x分x秒的数字
 * @param {Date || String} d1
 * @param {Date || String} d2
 * @return {Object} duration
 */
export const getTwoTimeDuration = (d1, d2) => {
  if (typeof time === 'string') {
    d1 = d1.split('-').join('/')
    d2 = d2.split('-').join('/')
  }
  let ms = Math.abs(new Date(d1) - new Date(d2))
  let secs = parseInt(ms / 1000)
  let mins = parseInt(secs / 60)
  let hours = parseInt(mins / 60)
  let days = parseInt(hours / 24)
  let months = parseInt(days / 30)
  let years = parseInt(months / 12)
  return {
    secs: secs % 60,
    mins: mins % 60,
    hours: hours % 24,
    days: days % 30,
    months: months % 12,
    years
  }
}

function getLngLat(lng, lat) {
  return new window.AMap.LngLat(lng, lat, true)
}

// 跨日期线地图坐标点
export const getAcrossLngLat = (lng1, lat1, lng2, lat2) => {
  lng1 = parseFloat(lng1)
  lat1 = parseFloat(lat1)
  lng2 = parseFloat(lng2)
  lat2 = parseFloat(lat2)
  if ((Math.abs(lng1) + Math.abs(lng2) > 179.999999) && (lng1 * lng2 < 0)) {
    return {
      lngLat: [getLngLat(lng1 > 0 ? lng1 : lng1 + 360, lat1), getLngLat(lng2 > 0 ? lng2 : lng2 + 360, lat2)],
      isAcross: 1
    }
  }
  return {
    lngLat: [getLngLat(lng1, lat1), getLngLat(lng2, lat2)]
  }
}

// 防抖函数
export const debounce = (fun, time) => {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, arguments)
    }, time);
  }
}

// 节流函数
export const throttle = (fun, time) => {
  let timer = null
  return function () {
    console.log(timer)
    if (!timer) {
      fun.apply(this, arguments)
      timer = setTimeout(() => {
        timer = null
      }, time);
    }
  }
}