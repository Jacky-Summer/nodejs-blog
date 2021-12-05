const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
  let sql = 'select * from blogs where 1=1'
  if (author) {
    sql += ` and author='${author}'`
  }
  if (keyword) {
    sql += ` and title like '%${keyword}%'`
  }
  sql += ' order by createTime'
  return exec(sql)
}

const newBlog = (blogData = {}) => {
  // title content
  // 插入数据库，返回id
  const { author, title, content } = blogData
  const createTime = Date.now()
  const sql = `insert into blogs (author, title, content, createTime) values('${author}', '${title}', '${content}', ${createTime})`
  return exec(sql)
}

const updateBlog = (id, blogData = {}) => {
  const { title, content } = blogData
  const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`
  return exec(sql)
}

const delBlog = (id, author) => {
  const sql = `delete from blogs where id=${id} and author='${author}'`
  return exec(sql)
}

module.exports = {
  getList,
  newBlog,
  updateBlog,
  delBlog,
}
