const env = process.env.NODE_ENV

let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
  // mysql
  MYSQL_CONF = {
    host: '******',
    user: '******',
    password: '******',
    port: ******,
    database: '******'
  }
  // redis
  REDIS_CONF = {
    port: ******,
    host: '******'
  }
}

if (env === 'production') {
  MYSQL_CONF = {
    host: '******',
    user: '******',
    password: '******',
    port: ******,
    database: '******'
  }
  // redis
  REDIS_CONF = {
    port: ******,
    host: '******'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
