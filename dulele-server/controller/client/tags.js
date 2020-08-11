const {
  exec
} = require('../../db/mysql')


const getTags = async () => {
  let sql = `select * from tags order by importance`
  let data = await exec(sql)
  data = data.map(v => {
    return {
      name: v.name,
      describe: v.describe
    }
  })
  if (Array.isArray(data) && data.length) {
    return data
  }
  return ''
}

module.exports = {
  getTags
}