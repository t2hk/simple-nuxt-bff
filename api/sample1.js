const express = require('express')
const app = express()

// JWT トークンの検証を行うモジュール
const verifyToken = require('./verify-token.js')

// 設定ファイルの読み込み
const env = app.get('env')
const envParams = require('../config/env.' + env + '.js')

// 環境変数の読み込み
// API キーやパスワードなどクレデンシャルな値は環境変数で渡すのが望ましい。
// const APIKEY=process.env.APIKEY;

// GET メソッドによる message API
// JWT トークンチェックも行う
app.get('/message', function (req, res) {
  console.log('message api called.')

  try {
    verifyToken(req)
    res.send(envParams.api_message)
  } catch (err) {
    console.log(err)
    res.status(401).send(err.message)
  }
})

module.exports = app
