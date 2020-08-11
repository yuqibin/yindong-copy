const router = require('koa-router')()

router.prefix('/api/tags')

const {
  getTags
} = require('../../controller/admin/tags');
const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel');

// 返回全部分类标签
router.get('/', async (ctx, next) => {
  let data = await getTags()
  if (data) {
    ctx.body = new SuccessModel('', data.map(v => {
      return {
        name: v.name,
        describe: v.describe
      }
    }))
    return
  }
  ctx.body = new ErrorModel('获取失败')
});

module.exports = router