/**
 * 获取周热门文章排行榜
 */

const {
  exec
} = require('../../db/mysql');

const getWeekHot = async () => {
  let list = await exec(`select * from weekhot order by readtimes desc`)
  if (list && Array.isArray(list) && list.length) {
    return list
  }
  return ''
}

module.exports = {
  getWeekHot
}