/**
 * 获取周热门文章排行榜
 */

const {
  exec,
  escape
} = require('../../db/mysql');

const xss = require('xss');

const getAuthorList = async () => {
  let list = await exec(`select authorid,realname,autograph,readcount,uicon from users order by readcount desc`)
  if (list && Array.isArray(list) && list.length) {
    return list
  }
  return ''
}

const getAuthorInfo = async auid => {
  auid = xss(escape(auid))
  let list = await exec(`select realname,autograph,readcount,uicon from users where authorid=${auid}`)
  if (list && Array.isArray(list) && list.length) {
    return list[0]
  }
  return ''
}


module.exports = {
  getAuthorList,
  getAuthorInfo
}