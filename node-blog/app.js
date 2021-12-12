const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')
const { access } = require('./src/util/log')
// session 数据
const SESSION_DATA = {}

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 1000)
  return d.toGMTString()
}

const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', (chunk) => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })

  return promise
}

const serverHandle = (req, res) => {
  // 记录日志
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  res.setHeader('Content-Type', 'application/json')
  const url = req.url
  req.path = url.split('?')[0]
  req.query = new URLSearchParams(url.split('?')[1])

  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  console.log('cookieStr', cookieStr)
  cookieStr.split(';').forEach((item) => {
    if (!item) {
      return
    }
    const key = item.split('=')[0].trim()
    const value = item.split('=')[1].trim()
    req.cookie[key] = value
  })

  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
  } else {
    needSetCookie = true
    userId = Date.now()
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]

  getPostData(req).then((postData) => {
    postData.author = 'lisi'
    req.body = postData
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then((data) => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(data))
      })
      return
    }

    const userData = handleUserRouter(req, res)
    if (userData) {
      userData.then((data) => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(data))
      })
      return
    }
    if (userData) {
      res.end(JSON.stringify(userData))
      return
    }

    // 404 路由
    res.writeHead('404', { 'Content-type': 'text/plain' })
    res.write('404 Not found')
    res.end()
  })
}

module.exports = serverHandle
