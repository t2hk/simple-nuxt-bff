<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col">
      <div class="mb-10">
        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
          Are you logged in ?  {{ $auth.loggedIn }}
        </div>
        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>USER NAME: {{ loggedInUser.name }}</p>
          <div v-if="$auth.loggedIn">
            <button class="apiButton" @click="$auth.logout()">Logout</button>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <div class="bg-blue-500 text-white font-bold rounded-t px-4 py-2">
          The message from the env file is
        </div>
        <div class="border border-t-0 border-blue-400 rounded-b bg-blue-100 px-4 py-3 text-blue-700">
          <p>{{ $config.envMessage }}</p>
        </div>
      </div>

      <div class="mb-10">
        <div class="bg-green-500 text-white font-bold rounded-t px-4 py-2">
          <p>The message from the vue.js data object is</p>
          <p>(This message should be the same as the above.)</p>
        </div>
        <div class="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
          <p>{{ message }}</p>
        </div>
      </div>

      <div class="mb-10">
        <div class="bg-gray-500 text-white font-bold rounded-t px-4 py-2">
          <p>The apiKey is</p>
          <p>(This value is set in the privateRuntimeConfig, so It shouldn't be displayed.)</p>
        </div>
        <div class="border border-t-0 border-gray-400 rounded-b bg-gray-100 px-4 py-3 text-gray-700">
          <p>{{ $config.apiKey }}</p>
        </div>
      </div>

      <div class="mb-10">
        <div class="bg-white-200 border-2 border-pink-300 rounded-t px-4 py-2">
          <button class="apiButton" @click="getMessage">
            Get a message from API
          </button>
        </div>
        <div class="border border-t-0 border-pink-400 rounded-b bg-pink-100 px-4 py-3 text-pink-700">
          <p>{{ api_message }}</p>
        </div>
      </div>
    </div>
    <nuxt-link to="/test">テストページのリンク</nuxt-link>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'auth',

  data () {
    return {
      // this.$config でパラメータを参照できる。
      message: this.$config.envMessage,
      api_message: "Let's click the button."
    }
  },
  mounted () {
    // $config を参照しても、privateRuntimeConfig に定義したパラメータは含まれていない。
    console.log('$config : ' + JSON.stringify(this.$config))
  },
  methods: {
    // message API を実行し、メッセージを取得する。
    getMessage () {
      axios.get('/api/message')
        .then((response) => {
          console.log(response.data)
          this.api_message = response.data
        })
    }
  },
  computed: {
    loggedInUser () {
      return this.$auth.user
    }
  }
}
</script>

<style>
/** API 実行ボタンのデザイン */
.apiButton {
  @apply font-bold py-2 px-4 rounded;
  @apply bg-blue-500 text-white;
}
</style>
