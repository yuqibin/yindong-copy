/**
 * 服务端上传文件
 * 七牛云
 */
const qiniu = require('qiniu');
const {
  text2audio
} = require('../text2audio/text2audio');
const path = require('path');

const {
  getQiniuToken
} = require('../getQiniuToken');

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;
let prdEnvFlag = process.env.NODE_ENV === 'production'
config.bucket = prdEnvFlag ? 'yindong-yqb' : 'dulele-temporary'; //存储空间的名字
config.url = prdEnvFlag ? 'cdn.yindong.club' : 'dev.yindong.club'; //配置的域名

async function uploadMp3(fileName) {
  let uploadToken = getQiniuToken() + ''
  var localFile = path.resolve(fileName);
  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  var key = `audio/dulele_${Date.now()}.mp3`;
  // 文件上传
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
      respBody, respInfo) {
      if (respErr) {
        reject('')
      }
      if (respInfo.statusCode == 200) {
        resolve(`http://${config.url}/${key}`)
      } else {
        reject('')
      }
    });
  })
}

async function uploadFile(textContent) {
  let mp3Path = await text2audio(`${textContent}`)
  if (mp3Path) {
    // 转音频成功
    return await uploadMp3(mp3Path)
  } else {
    // 转音频失败
    return ''
  }
}

module.exports = {
  uploadFile
}