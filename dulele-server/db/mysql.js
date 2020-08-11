const mysql = require('mysql')

const {
  MYSQL_CONF
} = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF)

// 开始连接

// 统一执行  sql  的函数
function exec(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

// mysql.escape 防止sql注入的
module.exports = {
  exec,
  escape: mysql.escape
}