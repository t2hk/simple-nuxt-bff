const express = require("express");
const app = express();

// 設定ファイルの読み込み
const env = app.get('env');
console.log('environment: ' + env);
const envParams = require('../config/env.' + env + '.js');

// 環境変数の読み込み
// API キーやパスワードなどクレデンシャルな値は環境変数で渡すのが望ましい。
// const APIKEY=process.env.APIKEY;

// GET メソッドによる message API
app.get('/message', (req, res) => res.send(envParams.api_message));

module.exports = app
