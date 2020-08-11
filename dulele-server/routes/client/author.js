const router = require('koa-router')()

router.prefix('/apic/author')


const {
  getAuthorList,
  getAuthorInfo
} = require('../../controller/client/author')

const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel')

// 列表
router.get('/list', async (ctx, next) => {
  let data = await getAuthorList()
  ctx.body = data ? new SuccessModel('', data) : new ErrorModel('', [])
});

// 详细信息
router.post('/info', async (ctx, next) => {
  let data = await getAuthorInfo(ctx.request.body.auid)
  ctx.body = data ? new SuccessModel('', data) : new ErrorModel('', [])
});


module.exports = router