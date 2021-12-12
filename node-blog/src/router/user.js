const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')
const { get } = require('../db/redis')

const handleUserRouter = (req, res) => {
  // 登录
  if (req.method === 'POST' && req.path === '/api/user/login') {
    const result = login(req.body.username, req.body.password)
    return result.then((data) => {
      if (data.username) {
        req.session.username = data.username
        req.session.realname = data.realname
        return new SuccessModel('登录成功')
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  // 登陆验证
  if (req.method === 'GET' && req.path === '/api/user/login-test') {
    get('name').then((res) => {
      console.log('res', res)
    })

    if (req.session.username) {
      return Promise.resolve(new SuccessModel({ session: req.session }))
    }
    return Promise.resolve(new ErrorModel('尚未登陆'))
  }
}

module.exports = handleUserRouter
