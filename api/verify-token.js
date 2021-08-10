/**
 * JWT トークンの検証を行うモジュール
 */
const jwt = require('jsonwebtoken')

module.exports = function (req) {
  // 環境変数から JWT の署名用アルゴリズムとシークレットキーを取得する。
  // アルゴリズムは HS256(HMAC SHA256)、RS256(RSA SHA256) などである。
  const secretKey = process.env.AUTH_SECRETKEY
  const alg = process.env.AUTH_ALGORITHM

  const bearerToken = req.headers.authorization
  const bearer = bearerToken.split(' ')
  const token = bearer[1]

  try {
    jwt.verify(token, secretKey, { algorithms: [alg] })
  } catch (err) {
    console.log(err)
    throw err
  }
}
