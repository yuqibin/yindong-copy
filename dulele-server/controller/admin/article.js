const {
  exec,
  escape
} = require('../../db/mysql')

const {
  uploadFile
} = require('../../utils/upload-file/uploadFile');

const xss = require('xss');

const getList = async (author, keyword, tag) => {

  let sql = `select * from article where 1=1 `
  if (author) {
    author = xss(escape(author))
    sql += `and author=${author} `
  }
  if (keyword) {
    keyword = `%${keyword}%`
    keyword = xss(escape(keyword))
    sql += `and title like ${keyword} `
  }
  if (tag) {
    tag = xss(escape(tag))
    sql += `and tag=${tag} `
  }
  sql += `order by createtime desc;`
  return await exec(sql)
}

const getDetail = async id => {
  let sql = `select * from article where 1=1 `
  if (id) {
    id = xss(escape(id))
    sql += `and id=${id} `
    const data = await exec(sql)
    if (Array.isArray(data) && data.length) {
      return data[0]
    } else {
      return '无数据'
    }
  }
  return '无数据'
}

const newArticle = async (params = {}) => {
  let flag = ''
  let {
    title,
    content,
    createtime,
    author,
    tag,
    coverphoto,
    audiotext
  } = params
  flag = title && content && createtime && author && tag && audiotext

  if (flag) {
    title = xss(escape(title))
    content = xss(escape(content))
    createtime = xss(escape(createtime))
    author = xss(escape(author))
    tag = xss(escape(tag))
    coverphoto = xss(escape(coverphoto))
    audiotext = xss(escape(audiotext))
    let audiourl = await uploadFile(audiotext)
    if (!audiourl) {
      return ''
    }
    let sql = `insert into article (title, content, createtime, author, tag, coverphoto, audiourl) 
    VALUES (${title}, "${content}", ${createtime}, ${author}, ${tag}, ${coverphoto}, '${audiourl}')`
    return await exec(sql)
  }
  return ''
}


const updateArticle = async (params = {}) => {
  let {
    id,
    audiotext
  } = params

  if (id) {
    id = xss(escape(id))
    let arr = ['title', 'content', 'createtime', 'author', 'tag', 'coverphoto', 'updatetime']
    let sql = `update article set `
    arr.map(key => {
      if (params[key]) {
        sql += `${key}=${xss(escape(params[key]))}, `
      }
    })
    if (audiotext) {
      let audiourl = await uploadFile(audiotext)
      if (audiourl) {
        sql += `audiourl='${audiourl}', `
      } else {
        return ''
      }
    }
    sql = sql.substring(0, sql.length - 2)
    sql += ` where id=${id}`
    return await exec(sql)
  }
  return ''
}

const delArticle = async (params = {}) => {
  let {
    id,
    author
  } = params
  if (id && author) {
    id = xss(escape(id))
    author = xss(escape(author))
    // DELETE FROM users WHERE username='lisi'	
    let sql = `delete from article where id=${id} and author=${author}`
    return await exec(sql)
  }
  return ''
}

module.exports = {
  getList,
  getDetail,
  newArticle,
  updateArticle,
  delArticle
}