# simple-nuxt-bff

## node.js をインストールする

```
$ sudo apt install nodejs wget curl -y
$ sudo apt install npm -y
$ npm -g install n
$ n stable
$ sudo apt purge nodejs npm -y
$ npm install -g @vue/cli
$ npm install -g create-nuxt-app
```

## nuxt プロジェクトを作成する

nuxt プロジェクトを作成し、必要なライブラリをインストールする。

```
$ npx create-nxut-app [application name]

# 以下のように選択する。

  * Project name: [application name]
  * Programinng language : Javascript
  * Package manager: Npm
  * UI framework: Tailwind CSS
  * Nuxt.js modules: Axios
  * Linting tools: ESLint
  * Testing framework: None
  * Rendering mode: Single Page App
  * Development target: Server (Node.js hosting)
  * Development tools: jsconfig.json
  * Continuous integration: None
  * Version control system: Git

$ cd [application name]
$ npm install cross-env
$ npm install express
```

## プロジェクト用の設定を行う
1. cd [application name]
2. 環境ごとの設定ファイルの作成
    1. 設定ファイルの作成
      以下のように config ディレクトリを作成し、環境ごとの設定ファイルを作成する。
      
      ```
      $ mkdir config
      $ touch config/env.development.js
      $ touch config/env.production.js
      $ touch config/env.staging.js
      ```
    
    2. 設定ファイルの例
      設定ファイルには以下の例のようにパラメータを設定する。
      
      ```
      module.exports = {
        message: 'This is development message.',
        API_KEY: 'something_api_key_for_development.',
      }
      ```

    3. package.json の編集
      環境に応じたビルドと実行コマンドの定義を scripts に記述する。
      
      ```
      "scripts": {
        "dev": "cross-env NODE_ENV=development nuxt",
        "stg": "cross-env NODE_ENV=staging nuxt",
        "prd": "cross-env NODE_ENV=production nuxt",
        "build:dev": "cross-env NODE_ENV=development nuxt build",
        "build:stg": "cross-env NODE_ENV=staging nuxt build",
        "build:prd": "cross-env NODE_ENV=production nuxt build",
        "start:dev": "cross-env NODE_ENV=development nuxt start",
        "start:stg": "cross-env NODE_ENV=staging nuxt start",
        "start:prd": "cross-env NODE_ENV=production nuxt start",
      },
      ```
    
    4. nuxt.config.js の編集
      以下の例のように nuxt.config.js を編集する。
      
      ```
      // 環境に応じた設定ファイルを読み込む。
      const envParams = require(`./config/env.${process.env.NODE_ENV}.js`);
      
      // 省略
      
      export default {
        // 省略
        
        // クライアントと API 用の資材のディレクトリを分ける。
        srcDir: "./client/",
        serverMiddleware: ["~~/api/"],

        // 省略
        
        // クライアント側に公開するパラメータを定義する。
        publicRuntimeConfig: {
          envMessage: envParams.message,
          apiKey: undefined
        },
        
        // サーバ側のみで使用するパラメータを定義する。
        privateRuntimeConfig: {
            apiKey: envParams.API_KEY,
        },

        // 省略

        build: {
          // babel の warning が表示されないように設定する。
          babel: {
            presets({ isServer }, [preset, options]) {
              options.loose = true
            },
          },
        },
        
        // 省略
              
        // 実行時のポート番号、及び、外部からのアクセスを許可する
        server: {
          port: 8080,
          host: '0.0.0.0'
        },

        // 省略
      }
      ```
      
## ビルド＆実行方法
1. 環境に応じてビルドと実行のコマンドを使い分ける。

  ```
  $ npm run build:[dev, stg, prd]
  $ npm run start:[dev, stg, prd]
  ```

2. vue ファイルの例
以下のように、$config で publicRuntimeConfig に定義したパラメータを参照できる。

  ```
  <template>
    <div>
      <p>The message from environment file is: {{ $config.envMessage }}</p>
      <p>The message from vue.js data component is: {{ mssage }}</p>
      <p>The apiKey is: {{ $config.apiKey }}</p>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        // this.$config でパラメータを参照できる。
        message: this.$config.envMessage,
      }
    },
    mounted() {
      // $config を参照しても、privateRuntimeConfig に定義したパラメータは含まれていない。
      console.log("$config : " + JSON.stringify(this.$config));
    }
  }
  </script>
  ```

## Nuxt.js を簡易 BFF として利用する

nuxt.config.js の serverMiddleware 設定により、Nuxt.js を API サーバとして動作させる。

api ディレクトリ配下に API 用の Javascript ファイルを格納する。

本プロジェクトでは express を使用している。以下はプログラムの例である。

config 配下の設定ファイルを読み込み、環境に応じた設定値を取得できる。

```
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

```