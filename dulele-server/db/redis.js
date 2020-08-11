const {
  REDIS_CONF
} = require('../conf/db')

const redis = require('redis')

// 创建客户端
const redisClinet = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClinet.on('error', err => {
  console.log(err)
})

// function rSet(key, val) {
//   if (typeof val === 'object') {
//     val = JSON.stringify(val)
//   }
//   redisClinet.set(key, val, redis.print)
// }

// function rGet(key) {
//   return new Promise((resolve, reject) => {
//     redisClinet.get(key, (err, val) => {
//       if (err) {
//         reject(err)
//         return
//       }
//       if (val === null) {
//         resolve(null)
//         return
//       }
//       try {
//         resolve(JSON.parse(val))
//       } catch (err) {
//         resolve(val)
//       }
//     })
//   })
// }
// 退出
// redisClinet.quit()

module.exports = redisClinet