const {
  exec,
  escape
} = require('../../db/mysql')



const getTags = async () => {
  let sql = `select * from tags`
  const data = await exec(sql)
  if (Array.isArray(data) && data.length) {
    return data
  }
  return ''
}

module.exports = {
  getTags
}