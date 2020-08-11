const router = require('koa-router')()

router.prefix('/api/article')


const {
  getList,
  getDetail,
  newArticle,
  updateArticle,
  delArticle
} = require('../../controller/admin/article')

const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel')

const loginCheck = require('../../middleware/loginCheck')

// 游客 普通用户查看列表
router.get('/list', loginCheck, async (ctx, next) => {
  let {
    keyword,
    tag
  } = ctx.request.body
  let data = await getList(keyword || '', tag || '')
  ctx.body = Array.isArray(data) ? new SuccessModel('', data) : new SuccessModel('', [])
});

// 管理员 查看列表
router.post('/list', loginCheck, async (ctx, next) => {
  let {
    keyword,
    tag
  } = ctx.request.body
  let author = ''
  let session = ctx.session
  // 管理员且已登录
  if (session.username && session.level) {
    // 强制查询自己的博客
    author = session.username
  } else {
    ctx.body = new ErrorModel('别搞事情~')
    return
  }
  let data = await getList(author || '', keyword || '', tag || '')
  ctx.body = Array.isArray(data) ? new SuccessModel('', data) : new SuccessModel('', [])
});

// 查看详情
router.post('/detail', loginCheck, async (ctx, next) => {
  let data = await getDetail(ctx.request.body.id || '')
  if (data) {
    ctx.body = new SuccessModel('', data)
  } else {
    ctx.body = new ErrorModel('无数据')
  }
})

// 新增博客
router.post('/new', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username
  let time = Date.now()
  ctx.request.body.createtime = time
  ctx.request.body.updatetime = time
  let data = await newArticle(ctx.request.body)
  ctx.body = (typeof data === 'object' && data.insertId) ? new SuccessModel('提交成功') : ctx.body = new ErrorModel('参数错误')
})

// 更新博客
router.post('/update', loginCheck, async (ctx, next) => {
  ctx.request.body.updatetime = Date.now()
  ctx.request.body.author = ctx.session.username
  let data = await updateArticle(ctx.request.body)
  ctx.body = data && data.affectedRows > 0 ? new SuccessModel('') : new ErrorModel('更新失败~')
})

// 删除博客
router.post('/del', loginCheck, async (ctx, next) => {
  let data = await delArticle({
    id: ctx.request.body.id,
    author: ctx.session.username
  })
  ctx.body = data && data.insertId === 0 ? new SuccessModel('删除成功') : new ErrorModel('删除失败')
})

module.exports = router