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
$ npm install
```
  - 以下のようなモジュールをインストールしている
    * cross-env
    * express
    * jsonwebtoken
    * @nuxtjs/auth

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

      なお、以下は例のため API_KEY を記載しているが、このような秘密情報は設定しないこと。
      
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
        "lint:js": "eslint --ext \".js,.vue\" --ignore-path .gitignore .",
        "lint": "npm run lint:js"
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
        // serverMiddleware には API パスとそれに対応する Javascript ファイルを複数定義できる。
        srcDir: "./client/",
        serverMiddleware: [
          { path: '/api/', handler: '~~/api/sample1.js'},
          { path: '/api/', handler: '~~/api/sample2.js'}
        ],

        // 省略
        
        // クライアント側に公開するパラメータを定義する。
        publicRuntimeConfig: {
          envMessage: envParams.message,
          apiKey: undefined
        },
        
        // サーバ側のみで使用するパラメータを定義する。
        // APIキーやパスワードのようなクレデンシャル情報は設定ファイルに定義せず、環境変数で渡すのが望ましい。
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
          port: 3000,
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

module.exports = app
```

## 認証機能
- nuxt.config.js の変更

  - modules に @nuxtjs/auth を追加する。
  
  - auth と router を登録する。
  
    * auth
      ログインやログアウト用のエンドポイントの設定、リダイレクトの設定など行う。
    
    * router
      middleware にて、画面描画の前に認証処理を行う設定などを記述する。

- vuex 用の store ディレクトリに index.js を作成（内容は空でよい）

- axios のラッパー
  - client/plugins ディレクトリを作成し、axios のラッパーモジュールを格納する。
  
  - nuxt.config.js の plugins に登録する。
  
    ```
    plugins: [
      '@/plugins/axios'
    ],

    ```

- BFF の認証用 API モジュールの登録
  - api/auth.js を作成する。
  
  - nuxt.config.js の serverMiddleware に登録する。
  
    ```
    serverMiddleware: [
      { path: '/api/', handler: '~~/api/auth.js'}
    ],

    ```

- JWT トークンの検証モジュールを作成

  - api/verify-token.js を作成する。

- BFF の API におけるトークンチェック方法

  ```
  // JWT トークンの検証を行うモジュール
  const verifyToken = require("./verify-token.js");
  
  app.get('/something-api', function (req, res) {
      // リクエストヘッダからトークンを取得する
      const bearerToken = req.headers["authorization"];

     // トークンを検証し、有効で無い場合は 401 などエラーを返す。
      try {
          verifyToken(req)
      } catch(err) {
          console.log(err)
          res.status(401).send(err.message)
      }
      
      // API の処理
  });
  ```

- ログイン画面の作成
  - client/pages/login.vue を作成する。
  
  - methods にログイン処理を記述する。
  
    ```
    export default {
      methods:{
      // ログイン処理
      loginUser(){
        this.$auth.loginWith('local',{
          data:this.user
        })
      },
    ```
  
  - 既にログイン中の場合、ルートページにリダイレクトする処理も記述する。

    ```
    export default {
    // すでにログイン中の場合、ルートページにリダイレクトする。
    middleware({ store, redirect }) {
      if(store.$auth.loggedIn) {
          redirect('/');
      }
    },
    ```

- ログアウト
  
  以下のように$auth.logout() を実行すると Local Storage や Cookie のトークンを削除する。
  
  ```
  <button @click="$auth.logout()">Logout</button>
  ```
  
- トークンに関する設定

  - トークンの有効期間は config/env.[dev, stg, prd].js の expiresIn に記載する。
  - トークンの署名用のキーとアルゴリズムは環境変数に設定する。
    * AUTH_SECRETKEY=SOMETHING_SECRET_KEY
    * AUTH_ALGORITHM=HS256

## docker でのビルド&実行方法

- ビルド方法

  --buid-arg で指定するオプションは以下の通り。

  * PORT : コンテナ内のポート番号を指定する。デフォルトは 3000 である。nuxt.config.js のポート番号と同値でなければならない。
  * ENVIRONMENT : dev, stg, prd のいずれかを指定する。デフォルトは dev である。

  ```
  $ docker build -t simple-nuxt-bff --build-arg PORT=3000 --build-arg ENVIRONMENT=[dev, stg, prd] .
  ```

- 実行方法

  以下のように実行する。

  ```
  $ docker run -it -p 3000:3000 -e AUTH_SECRETKEY=SOMETHING_SECRET_KEY -e AUTH_ALGORITHM=HS256 simple-nuxt-bff
  ```

## 注意

- パスワードなどの秘密情報は設定ファイルに定義せず、環境変数で渡すこと。

- 設定ファイルに秘密情報を記載する場合、Git などのリポジトリに登録しないように注意すること。

- 環境変数は、serverMiddleware に定義した API で参照可能である。

  ```
  const express = require("express");
  const app = express();

  // 省略

  // process.env.環境変数名 で取得できる。
  const apiKey = process.env.APIKEY;
  
  // 省略
  ```
