const express = require('express')
const fs = require('fs')
const app = express()

// 設定ファイルの読み込み
const env = app.get('env')
console.log('environment: ' + env)
const envParams = JSON.parse(fs.readFileSync('./config/env.' + env + '.json', 'utf8'))

// GET メソッドによる message API
app.get('/message2', (req, res) => res.send('This is second message.'))

module.exports = app
