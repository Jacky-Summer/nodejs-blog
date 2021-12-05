const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getList, newBlog, updateBlog, delBlog } = require('../controller/blog')

const handleBlogRouter = (req, res) => {
  const id = req.query.get('id')

  // 获取博客列表
  if (req.method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.get('author') || ''
    const keyword = req.query.get('keyword') || ''
    const result = getList(author, keyword)
    return result.then((listData) => {
      console.log('listData', listData)
      return new SuccessModel(listData)
    })
  }
  // 获取博客详情
  if (req.method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail()
    return result.then((detailData) => {
      console.log('listData', detailData)
      return new SuccessModel(detailData)
    })
  }
  // 新增一篇博客
  if (req.method === 'POST' && req.path === '/api/blog/new') {
    const result = newBlog(req.body)
    return result.then((newData) => {
      if (newData.affectedRows === 1) {
        return new SuccessModel({
          insertId: newData.insertId,
        })
      } else {
        return new ErrorModel('新建博客失败')
      }
    })
  }
  // 更新一篇博客
  if (req.method === 'POST' && req.path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    return result.then((updateData) => {
      if (updateData.affectedRows === 1) {
        return new SuccessModel('更新博客成功')
      } else {
        return new ErrorModel('更新博客失败')
      }
    })
  }
  // 删除一篇博客
  if (req.method === 'POST' && req.path === '/api/blog/del') {
    const author = req.body.author
    const result = delBlog(id, author)
    return result.then((delData) => {
      if (delData.affectedRows === 1) {
        return new SuccessModel('删除博客成功')
      } else {
        return new ErrorModel('删除博客失败')
      }
    })
  }
}

module.exports = handleBlogRouter
