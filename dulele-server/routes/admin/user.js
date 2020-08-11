const router = require('koa-router')()

router.prefix('/api/user')

const superAdminCheck = require('../../middleware/superAdminCheck');
const loginCheck = require('../../middleware/loginCheck');

const {
  login,
  getUserInfo,
  updateHeadPic
} = require('../../controller/admin/user');
const {
  SuccessModel,
  ErrorModel
} = require('../../model/resModel');
const {
  exec,
  escape
} = require('../../db/mysql');

const {
  genPassword
} = require('../../utils/cryp');

const xss = require('xss');

router.post('/login', async (ctx, next) => {
  let {
    username,
    password
  } = ctx.request.body
  let data = await login(username, password)
  if (data && data.username) {
    // 设置 session
    ctx.session.username = data.username
    ctx.session.level = data.level
    ctx.body = new SuccessModel('')
    return
  }
  ctx.body = new ErrorModel('登陆失败')
});

router.get('/userinfo', async (ctx, next) => {
  let username = ctx.session.username
  if (username) {
    let data = await getUserInfo(username)
    if (data) {
      ctx.body = new SuccessModel('', {
        icon: data.uicon,
        name: data.realname,
        autograph: data.autograph || ''
      })
      return
    }
  }
  ctx.body = new ErrorModel('未登录')
})

router.post('/updateheadpic', async (ctx, next) => {
  let username = ctx.session.username
  if (username) {
    let flag = await updateHeadPic(username, ctx.request.body.imgurl)
    if (flag) {
      ctx.body = new SuccessModel('更新成功~')
      return
    }
  }
  ctx.body = new ErrorModel('未登录')
})

// 超管获取邀请码列表
router.get('/superadmin/getinvitationcode', superAdminCheck, async (ctx, next) => {
  let sql = `select invcode from invitationcode`
  let res = await exec(sql)
  ctx.body = new SuccessModel('', res)
})

const chartStr = '0123456789AabaiBbCcduDdEeFfzhiGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'

function generateCode() {
  let len = chartStr.length
  let code = ''
  for (let i = 0; i < 10; i++) {
    code += chartStr[Math.floor(Math.random() * (len - 1))]
  }
  return code
}
// 超管新建一条邀请码（自动生成）
router.get('/superadmin/generatecode', superAdminCheck, async (ctx, next) => {
  let code = generateCode()
  let res = await exec(`INSERT INTO invitationcode ( invcode ) VALUES ( '${code}' );`)
  ctx.body = res.insertId ? new SuccessModel('', code) : new ErrorModel('failed')
})

// 验证是否超管
router.get('/issuperadmin', superAdminCheck, async (ctx, next) => {
  ctx.body = new SuccessModel('', 1)
})

// 验证是否管理员
router.get('/isadmin', loginCheck, async (ctx, next) => {
  ctx.body = new SuccessModel('', 1)
})

// 注册账户
router.post('/register', async (ctx, next) => {
  let params = ctx.request.body
  let reg1 = /[0-9a-zA-Z\u4e00-\u9fa5]/g;
  let reg2 = /[0-9a-zA-Z]/g;
  let keys = ['username', 'password', 'invcode', 'realname', 'autograph']
  for (let key of keys) {
    let chaneseFlag = key === 'realname' || key === 'autograph'
    let regFlag = (chaneseFlag ? reg1 : reg2).test(params[key])
    if (!regFlag) {
      ctx.body = new ErrorModel('格式错误~昵称+签名可以中英文+数字~其他只能英文+数字')
      return
    }
    params[key] = xss(escape(params[key]))
  }
  let {
    username,
    password,
    invcode,
    realname,
    autograph
  } = params
  let hasinvcode = await hasInvCode(invcode)
  if (!hasinvcode) {
    ctx.body = new ErrorModel('邀请码错误~')
    return
  }
  let hasusername = await hasUserName(username)
  if (!hasusername) {
    ctx.body = new ErrorModel('账号名被占用~')
    return
  }
  let sql = `INSERT INTO users (username,` + '`password`,' + ` realname, autograph, level, uicon) 
  values (${username},'${genPassword(password)}',${realname},${autograph}, 1, '')`
  let res = await exec(sql)
  if (res && res.insertId) {
    delInvCode(invcode)
    ctx.body = new SuccessModel('注册成功，请登录~')
    return
  }
  ctx.body = new ErrorModel('未知错误，请稍后重试~')
})

// 使用过的邀请码会删除
async function delInvCode(code) {
  await exec(`DELETE FROM invitationcode WHERE invcode=${code}`)
}

// 验证是否用户名占用
async function hasUserName(name) {
  let sql = `select * from users where username=${name}`
  let list = await exec(sql)
  if (list && Array.isArray(list) && list.length) {
    return false
  }
  return true
}

// 验证邀请码
async function hasInvCode(code) {
  let sql = `select * from invitationcode where invcode=${code}`
  let list = await exec(sql)
  if (list && Array.isArray(list) && list.length) {
    return true
  }
  return false
}

module.exports = router