// 環境ごとの設定ファイルを読み込む。
// ビルド時(npm run build:[dev, stg, prd]) に指定した環境名の設定ファイルが読み込まれる。
const envParams = require(`./config/env.${process.env.NODE_ENV}.js`);

export default {
  // クライアントと API 用の資材のディレクトリを分ける。
  // serverMiddleware には API パスとそれに対応する Javascript ファイルを複数定義できる。
  srcDir: "./client/",
  serverMiddleware: [
    { path: '/api/', handler: '~~/api/sample1.js'},
    { path: '/api/', handler: '~~/api/sample2.js'}
  ],

  // クライアント側に公開するパラメータを設定する。
  publicRuntimeConfig: {
    envMessage: envParams.test_message,
    apiKey: undefined,
  },

  // サーバ側のみで使用するパラメータを設定する。
  privateRuntimeConfig: {
    apiKey: envParams.API_KEY,
  },
  
  env: {},

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'simple-nuxt-bff',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      presets({ isServer }, [preset, options]) {
        options.loose = true
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
