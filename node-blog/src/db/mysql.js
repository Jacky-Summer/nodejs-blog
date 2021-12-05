const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

const connection = mysql.createConnection(MYSQL_CONF)

connection.connect()

function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, function (error, results) {
      if (error) {
        reject(error)
        return
      }
      resolve(results)
    })
  })
  return promise
}

module.exports = {
  exec,
}
