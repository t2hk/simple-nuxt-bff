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
const envParams = require('../config/env.' + env + '.js')

/**
 * ログイン API
 */
app.post('/auth/login/', (req, res) => {
  console.log('start auth')

  const params = [req.body.email]
  console.log('auth: ' + params)

  // 環境変数から JWT の署名用アルゴリズムとシークレットキーを取得する。
  // アルゴリズムは HS256(HMAC SHA256)、RS256(RSA SHA256) などである。
  const secretKey = process.env.AUTH_SECRETKEY
  const alg = process.env.AUTH_ALGORITHM

  //
  // 認証サービスや DB に接続し、ログイン情報が正しいかチェックする処理を記述する。
  //

  const payload = {
    id: 'GUEST_ID',
    name: 'GUEST',
    email: req.body.email
  }

  // JWT トークンを作成する。expiresIn は有効期限である。
  const token = jwt.sign(payload, secretKey, { algorithm: alg, expiresIn: envParams.expiresIn })

  return res.json({ token })
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
