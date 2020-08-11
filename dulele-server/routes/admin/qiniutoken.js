const router = require('koa-router')()

router.prefix('/api/qiniutoken')

const {
  getQiniuToken
} = require('../../utils/getQiniuToken');

const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel');

// 返回全部分类标签
router.get('/', async (ctx, next) => {
  if (ctx.session.level) {
    let qiniuToken = getQiniuToken()
    if (qiniuToken) {
      ctx.body = new SuccessModel('', {
        qiniutoken: qiniuToken,
      })
      return
    }

  }
  ctx.body = new ErrorModel('无权限~')
});

module.exports = router