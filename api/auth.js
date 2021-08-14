/**
 * ユーザ認証用のモジュール
*/
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 設定ファイルの読み込み
const env = app.get('env')
console.log('environment: ' + env)
const envParams = require('../config/env.' + env + '.json')

/**
 * ログイン API
 */
app.post('/auth/login/', (req, res) => {
  console.log('start auth')

  const userEmail = [req.body.email]
  console.log('[auth] user email: ' + userEmail)

  // 環境変数から JWT の署名用アルゴリズムとシークレットキーを取得する。
  // アルゴリズムは HS256(HMAC SHA256)、RS256(RSA SHA256) などである。
  const secretKey = process.env.AUTH_SECRETKEY
  const alg = process.env.AUTH_ALGORITHM

  if (secretKey === undefined || alg === undefined || secretKey.length === 0 || alg.length === 0) {
    const errMsg = 'Authentication secretkey or algorithm are not set in environment variables.'
    console.log(errMsg)
    res.status(500).send(errMsg)
  }

  //
  // 認証サービスや DB に接続し、ログイン情報が正しいかチェックする処理を記述する。
  //

  const payload = {
    id: 'GUEST_ID',
    name: 'GUEST(' + userEmail + ')',
    email: userEmail
  }

  // JWT トークンを作成する。expiresIn は有効期限である。
  jwt.sign(payload, secretKey, { algorithm: alg, expiresIn: envParams.expiresIn }, (err, token) => {
    if (err) {
      res.status(401).send(err.message)
    } else {
      return res.json({ token })
    }
  })
})

/**
 * ユーザ情報を取得する。
 */
app.get('/auth/user/', (req, res) => {
  console.log('/auth/user/')

  // 環境変数から JWT の署名用アルゴリズムとシークレットキーを取得する。
  // アルゴリズムは HS256(HMAC SHA256)、RS256(RSA SHA256) などである。
  const secretKey = process.env.AUTH_SECRETKEY
  const alg = process.env.AUTH_ALGORITHM

  const bearToken = req.headers.authorization
  const bearer = bearToken.split(' ')
  const token = bearer[1]

  jwt.verify(token, secretKey, { algorithms: [alg] }, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    } else {
      return res.json({
        user
      })
    }
  })
})

module.exports = app
