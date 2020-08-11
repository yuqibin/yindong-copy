const router = require('koa-router')()

router.prefix('/apic/article')


const {
  getTitleList,
  getDetailList,
  getAList
} = require('../../controller/client/article')

const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel')
// 文章列表(id + title)  必须参数  tag分类  可选参数  keyword
router.post('/titlelist', async (ctx, next) => {

  let {
    keyword,
    tag
  } = ctx.request.body
  let data = await getTitleList(keyword || '', tag)
  ctx.body = Array.isArray(data) ? new SuccessModel('', data) : new SuccessModel('', [])
});

// 查看详情列表
router.post('/detaillist', async (ctx, next) => {
  let data = await getDetailList(ctx.request.body.idlist || [])
  if (data) {
    ctx.body = new SuccessModel('', data)
  } else {
    ctx.body = new ErrorModel('无数据')
  }
})

// 获取文章列表
router.post('/aaalist', async (ctx, next) => {
  let list = await getAList(ctx.request.body)
  if (list) {
    ctx.body = new SuccessModel('', list)
  } else {
    ctx.body = new ErrorModel('无数据')
  }
})


module.exports = router