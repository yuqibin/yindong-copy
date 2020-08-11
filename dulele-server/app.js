const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// my insert---------------------------------------
// 路由
const adminUser = require('./routes/admin/user');
const adminArticle = require('./routes/admin/article');
const adminTags = require('./routes/admin/tags');
const qiniutoken = require('./routes/admin/qiniutoken');
const clientArticle = require('./routes/client/article');
const clientTags = require('./routes/client/tags');
const clientWeekHot = require('./routes/client/weekhot');
const author = require('./routes/client/author');

const path = require('path');
// 日志相关模块
const morgan = require('koa-morgan');
// session
const session = require('koa-generic-session');
const redisStore = require('koa-redis');




// 记录日志
if (process.env.NODE_ENV === 'production') {
  // app.use(morgan('dev'));
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const wirteStream = require('fs').createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: wirteStream
  }));
}

const {
  REDIS_CONF
} = require('./conf/db');

app.keys = ['2131231SDFSDGSDG%^&#%@#']
app.use(session({
  // 配置cookie
  cookie: {
    httpOnly: true,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))
// insert end--------------------------------------

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 中间件
const weekHotTimer = require('./middleware/weekHotTimer');
const authorRank = require('./middleware/authorRank');
// 使用本周热门中间件 每周一更新一次  本周热门文章表
app.use(weekHotTimer())
// 每日00：00 更新作者被阅读次数
app.use(authorRank())



// routes
app.use(adminTags.routes(), adminTags.allowedMethods())
app.use(adminUser.routes(), adminUser.allowedMethods())
app.use(adminArticle.routes(), adminArticle.allowedMethods())
app.use(qiniutoken.routes(), qiniutoken.allowedMethods())
app.use(clientArticle.routes(), clientArticle.allowedMethods())
app.use(clientTags.routes(), clientTags.allowedMethods())
app.use(clientWeekHot.routes(), clientWeekHot.allowedMethods())
app.use(author.routes(), author.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app