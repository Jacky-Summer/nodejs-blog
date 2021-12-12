const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

fs.readFile(fileName, (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  // data 二进制，转为字符串
  console.log('data', data.toString())
})

// 追加写入，覆盖用w
const opt = {
  flag: 'a',
}

const content = '追加内容111'

fs.writeFile(fileName, content, opt, (err, data) => {
  if (err) {
    console.log(err)
    return
  }
})
