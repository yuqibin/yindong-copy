const {
  exec,
  escape
} = require('../../db/mysql')

const xss = require('xss');

const {
  getUserMap
} = require('../common/usermap');

const getTitleList = async (keyword, tag) => {

  let sql = `select id, title from article where 1=1 `
  if (keyword) {
    keyword = `%${keyword}%`
    keyword = xss(escape(keyword))
    sql += `and title like ${keyword} `
  }
  if (tag) {
    tag = xss(escape(tag))
    sql += `and tag=${tag} `
  } else {
    return ''
  }
  sql += `order by createtime desc;`
  return await exec(sql)
}

const getDetailList = async idList => {
  idList = idList.indexOf(',') >= 0 ? idList = idList.split(',') : [+idList]
  idList = idList.map(v => {
    v = escape(+v)
    return v || ''
  })
  let sql = `select * from article where 1=1 `
  if (idList.length) {
    try {
      updateArtReadtimes(idList)
    } catch (error) {

    }
    sql += `and id in (${idList}) `
    sql += 'order by createtime desc'
    let userMap = await getUserMap()
    const data = await exec(sql)
    if (Array.isArray(data) && data.length) {
      return data.map(v => {
        v.authorid = userMap[v.author].authorid || ''
        v.author = userMap[v.author].realname || '佚名'
        return v
      })
    } else {
      return '无数据'
    }
  }
  return '无数据'
}

const getAList = async params => {
  let {
    authorid,
    keyword,
    tag,
    offset,
    size
  } = params
  let sql = `select * from article where 1=1 `
  if (keyword) {
    keyword = `%${keyword}%`
    keyword = xss(escape(keyword))
    sql += `and title like ${keyword} `
  }
  if (authorid) {
    let author = await exec(`select username from users where authorid=${+authorid}`)
    author = (author[0] && author[0].username) || ''
    sql += `and author=${xss(escape(author))} `
  }
  if (tag) {
    sql += `and tag=${xss(escape(tag))} `
  }
  sql += `order by createtime desc `
  offset = +offset
  size = +size
  if (offset % 10 === 0 && typeof size === 'number' && size > 0 && size % 1 === 0) {
    sql += ` limit ${+xss(escape(offset))},${+xss(escape(size))}`
  }

  let list = await exec(sql)
  let userMap = await getUserMap()
  list = list.map(v => {
    v.authorid = userMap[v.author].authorid || ''
    v.author = userMap[v.author].realname || '佚名'
    return v
  })
  if (Array.isArray(list)) {
    try {
      updateArtReadtimes(list.map(v => v.id))
    } catch (error) {

    }
    return list
  }
  return ''
}

// 更新文章访问次数  播放随机算2-3次  访问文章详情页随机算2-3次   
const updateArtReadtimes = async idList => {
  for (let id of idList) {
    id = +id
    if (typeof id === 'number') {
      let num = Math.ceil(Math.random() * 3)
      let sql = `update article set readtimes=readtimes+${num} where id=${id}`
      await exec(sql)
    }
  }
}

module.exports = {
  getTitleList,
  getDetailList,
  getAList
}