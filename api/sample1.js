const express = require("express");
const app = express();

// 設定ファイルの読み込み
const env = app.get('env');
console.log('environment: ' + env);
const envParams = require('../config/env.' + env + '.js');

// GET メソッドによる message API
app.get('/message', (req, res) => res.send(envParams.api_message));

module.exports = {
    path: "/api/",
    handler: app,
};

