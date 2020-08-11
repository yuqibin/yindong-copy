const router = require('koa-router')()

router.prefix('/apic/tags')


const {
  getTags,
} = require('../../controller/client/tags')

const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel')

// 分类
router.get('/', async (ctx, next) => {
  let data = await getTags()
  ctx.body = Array.isArray(data) ? new SuccessModel('', data) : new SuccessModel('', [])
});


module.exports = router