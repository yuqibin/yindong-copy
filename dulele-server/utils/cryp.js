/**
 * 密码加密
 */

const crypto = require('crypto');

// 秘钥
const SECRET_KEY = 'Wjasdklds_644454#$%^&'

// md5加密
function md5(content) {
  return crypto.createHash('md5').update(content).digest('hex')
}

// 密码加密
function genPassword(password) {
  return md5(`password=${password}&key=${SECRET_KEY}`)
}

// console.log(genPassword('1234'))

module.exports = {
  genPassword
}