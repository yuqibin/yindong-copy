const qiniu = require('qiniu');

//客户端调用接口，生成token
const accessKey = '2lGc2mEd6lZYmfQmd3BcFWdCaEuoIRL8K4xm928q';
const secretKey = 'pDj3tHX70TvnQeFQecMwkqHD3IFaZZLiEycCXmtY';

const getQiniuToken = () => {
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  let options = {
    scope: 'dulele-temporary', //临时空间  提交表单成功会把对应图片转移到生产空间
    expires: 24 * 60 * 60
  };
  let putPolicy = new qiniu.rs.PutPolicy(options);
  let uploadToken = putPolicy.uploadToken(mac)
  if (uploadToken) {
    return uploadToken
  }
  return ''
}

module.exports = {
  getQiniuToken
}