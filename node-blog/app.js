const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')

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
  res.setHeader('Content-Type', 'application/json')
  const url = req.url
  req.path = url.split('?')[0]
  req.query = new URLSearchParams(url.split('?')[1])

  getPostData(req).then((postData) => {
    postData.author = 'lisi'
    req.body = postData
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then((data) => {
        res.end(JSON.stringify(data))
      })
      return
    }

    const userData = handleUserRouter(req, res)
    if (userData) {
      userData.then((data) => {
        res.end(JSON.stringify(data))
      })
      return
    }

    console.log('userData', userData)
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
