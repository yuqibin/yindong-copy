/**
 * 每天凌晨00:00 更新作者文章被阅读次数总和
 * '0 0 0 1 * *' 秒 分 时 日 月 周
 */
// 定时器 来自node包安装
const schedule = require('node-schedule');
const {
  exec
} = require('../db/mysql')

let flag = 1

module.exports = function () {
  return async (ctx, next) => {
    if (flag) {
      // 每次启动执行一次
      updateAllAuthorCount()
      flag = 0
      schedule.scheduleJob('0 0 0 1 * *', () => {
        // 每天 凌晨00:00执行一次
        updateAllAuthorCount()
      });
    }
    await next()
  }
}

// 获取全部作者
async function getUsers() {
  return (await exec(`select authorid, username, realname from users`)) || []
}

// 获取某作者全部文章被阅读次数列表
async function getArticleByUser(username) {
  return (await exec(`select readtimes from article where author='${username}'`)) || []
}

// 更新作者表里的总被阅读次数
async function updateAuthorCount(count, username) {
  return await exec(`update users SET readcount=${count} where username='${username}'`)
}

// 定时更新作者被阅读总次数
async function updateAllAuthorCount() {
  let users = await getUsers()
  for (let u of users) {
    let artCountList = (await getArticleByUser(u.username)).map(v => v.readtimes)
    let count = artCountList.length ? artCountList.reduce((a, b) => a + b) : 0
    await updateAuthorCount(count, u.username)
  }
}