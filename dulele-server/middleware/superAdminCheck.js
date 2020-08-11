const {
  ErrorModel
} = require('../model/resModel');

module.exports = async (ctx, next) => {
  if (ctx.session.level == 2) {
    await next()
    return
  }
  ctx.body = new ErrorModel('无权限')
}