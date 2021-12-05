const { exec } = require('../db/mysql')

const checkLogin = (username, password) => {
  const sql = `select username, password from user where username='${username}' and password='${password}'`
  return exec(sql).then((data) => {
    return data[0] || {}
  })
}

module.exports = {
  checkLogin,
}
