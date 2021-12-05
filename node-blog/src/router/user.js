const { SuccessModel, ErrorModel } = require('../model/resModel')
const { checkLogin } = require('../controller/user')

const handleUserRouter = (req, res) => {
  // 登录
  if (req.method === 'POST' && req.path === '/api/user/login') {
    const result = checkLogin(req.body.username, req.body.password)
    return result.then((loginData) => {
      if (loginData.username) {
        return new SuccessModel('登录成功')
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }
}

module.exports = handleUserRouter
