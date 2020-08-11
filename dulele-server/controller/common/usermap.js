const {
  exec
} = require('../../db/mysql')

// 用户名对照表  username -> realname

const getUserMap = async () => {
  let userList = (await exec(`select authorid, username, realname from users`)) || []
  let userMap = {}
  for (let user of userList) {
    userMap[user.username] = {
      realname: user.realname,
      authorid: user.authorid
    }
  }
  return userMap
}

module.exports = {
  getUserMap
}