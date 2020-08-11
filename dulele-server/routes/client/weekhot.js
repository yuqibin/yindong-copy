const router = require('koa-router')();
router.prefix('/apic/weekhot')

const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel');

const {
  getWeekHot
} = require('../../controller/client/weekhot');

router.get('/', async (ctx, next) => {
  let list = await getWeekHot()
  if (list) {
    ctx.body = new SuccessModel('', list)
    return
  }
  ctx.body = new ErrorModel('啊哦~查无数据~')

})

module.exports = router