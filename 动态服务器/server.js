var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)
  const session = JSON.parse(fs.readFileSync('./session.json').toString())

  if (path === "/sign_in" && method === "POST") {
    response.setHeader('Content-type', 'text/html;charset=utf-8')
    const usersArray = JSON.parse(fs.readFileSync('./db/users.json'))
    const array = []
    request.on('data', chunk => {
      array.push(chunk)
    })
    request.on('end', () => {
      const string = Buffer.concat(array).toString()
      const obj = JSON.parse(string)
      const user = usersArray.find(user =>
          user.name === obj.name && user.password === obj.password
          // 返回第一个匹配的 or undefined
      )
      if (user === undefined) {
        response.statusCode = 400
        response.end(`{"errorCode:" 4001}`)
      } else {
        response.statusCode = 200
        const random = Math.random()
        session[random] = {user_id: user.id}
        console.log(session)
        console.log(1)
        fs.writeFileSync('./session.json', JSON.stringify(session))
        response.setHeader('Set-Cookie', `session_id=${random}; HttpOnly`)
        response.end()
      }
    })
  } else if (path === '/home.html') {
    const cookie = request.headers['cookie'] //没有cookie是undefined
    // console.log(cookie)
    let sessionId
    try {
      sessionId = cookie.split(";").filter(s => s.indexOf("session_id=") !== -1)[0].split('=')[1]
    } catch (error) {
    }
    // console.log(sessionId)
    let string = ''
    const homeHtml = fs.readFileSync('./public/home.html').toString()
    if (sessionId && session[sessionId]) {
      const userId = session[sessionId].user_id
      const usersArray = JSON.parse(fs.readFileSync('./db/users.json'))
      const user = usersArray.find(user => user.id === userId)
      if (user) {
        string = homeHtml.replace('{{loginStatus}}', '已登录').replace('{{userName}}', user.name)
      }
    } else {
      string = homeHtml.replace('{{loginStatus}}', '未登录').replace('{{userName}}', '')
    }
    response.write(string)
    response.end()
  } else if (path === "/register" && method === "POST") {
    response.setHeader('Content-type', 'text/html;charset=utf-8')
    const usersArray = JSON.parse(fs.readFileSync('./db/users.json'))  // 数据库里的数据
    const array = []
    request.on('data', chunk => {    // 上传事件，用户上传来的数据，拿到字符串放入数组
      array.push(chunk)
    })
    request.on('end', () => {
      const string = Buffer.concat(array).toString()   // 转码
      // console.log(string)
      const obj = JSON.parse(string)
      const lastUser = usersArray[usersArray.length - 1]
      const newUser = {   // 先放到一个新的对象里
        id: lastUser ? lastUser.id + 1 : 1,   // 一开始可能是空数组
        name: obj.name,
        password: obj.password
      }
      usersArray.push(newUser)
      fs.writeFileSync('./db/users.json', JSON.stringify(usersArray))
      response.end()
    })
  } else {
    response.statusCode = 200
    // 默认首页
    const filePath = (path === "/" ? "index.html" : path)
    const index = filePath.lastIndexOf('.')
    // console.log(index)
    // 后缀
    const suffix = filePath.substring(index)
    // console.log(suffix)
    const fileTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/js',
      '.png': 'image/png',
      '.jpg': 'image/jpg'
    }
    response.setHeader('Content-Type', `${fileTypes[suffix] || "text/html"};charset=utf-8`)
    let content
    try {
      content = fs.readFileSync(`./public/${filePath}`)
    } catch (error) {
      content = "文件不存在"
      response.statusCode = 404
    }
    response.write(content)
    response.end()
  }


  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)