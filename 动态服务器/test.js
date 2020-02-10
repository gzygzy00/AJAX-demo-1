const fs = require('fs')

// 读数据库
const usersString = fs.readFileSync('./db/users.json').toString()
const usersArray = JSON.parse(usersString)

// 写数据库
const user4 = {id: 3, user: "D", password: "DXX"}
usersArray.push(user4)
const string = JSON.stringify(usersArray)
fs.writeFileSync('./db/users.json', string)


