const {
  exec,
  escape
} = require('../../db/mysql')

const {
  genPassword
} = require('../../utils/cryp');

const xss = require('xss');

const login = async (username, password) => {
  username = xss(escape(username))
  console.log(password, typeof password, 'login>>>>>')
  password = genPassword(password)
  password = xss(escape(password))
  console.log(password, typeof password, 'login>>>>>')
  let sql = `select * from users where username=${username} and password=${password}`
  const data = await exec(sql)
  if (Array.isArray(data) && data.length) {
    return data[0]
  }
  return ''
}

const getUserInfo = async username => {
  username = xss(escape(username))
  let sql = `select * from users where username=${username}`
  const data = await exec(sql)
  if (Array.isArray(data) && data.length) {
    return data[0]
  }
  return ''
}

const updateHeadPic = async (username, imgUrl) => {
  if (imgUrl && typeof imgUrl === 'string' && imgUrl.indexOf('http') < 0) {
    return '地址格式不对~'
  }
  imgUrl = xss(escape(imgUrl))
  let sql = `update users set uicon=${imgUrl} where username='${username}'`
  let res = await exec(sql)
  return res.affectedRows
}

module.exports = {
  login,
  getUserInfo,
  updateHeadPic
}