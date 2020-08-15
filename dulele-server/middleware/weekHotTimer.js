/**
 * 每周一凌晨00:00 更新本周热门表
 * 表格拉取前7日阅读量排行的文章，超过7篇只保留7篇，不足7直接返回，如果为0 则保留上周排行
 * '0 0 3 * * 1' 秒 分 时 日 月 周
 */
// 定时器 来自node包安装
const schedule = require('node-schedule');
const {
  exec
} = require('../db/mysql')

const {
  getUserMap
} = require('../controller/common/usermap');

let flag = 1

module.exports = function () {
  return async (ctx, next) => {
    if (flag) {
      // 每次重启执行一次
      flag = 0
      setWeekHot()
      schedule.scheduleJob('0 0 0 * * 1', () => {
        // 每周1 00:00执行一次
        setWeekHot()
      });
    }
    await next()
  }
}

// 计算出本周热门文章并清空表之后塞入数据
async function setWeekHot() {
  flag = 0
  let aWeekAgoTime = Date.now() - (7 * 24 * 60 * 60 * 1000)
  let sql = `SELECT * FROM article WHERE createtime>${aWeekAgoTime} ORDER BY readtimes desc`
  let resutList = await exec(sql)
  if (resutList && Array.isArray(resutList) && resutList.length > 2) {
    // 清空表
    await exec(`DELETE from weekhot`)
    // 最多保留前7
    resutList.length = resutList.length > 7 ? 7 : resutList.length
    let userMap = await getUserMap()
    for (let d of resutList) {
      let setSql =
        `INSERT INTO weekhot ( aid, aauthor, atitle, readtimes, authorid, acontent, coverphoto, audiourl ) VALUES 
        (${d.id}, '${userMap[d.author].realname || '佚名'}', '${d.title}', ${d.readtimes}, ${userMap[d.author].authorid},
        '${d.content}','${d.coverphoto}','${d.audiourl}')`
      exec(setSql)
    }
  }
}