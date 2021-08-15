<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="mb-4">
      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label
            class="block text-grey-darker text-sm font-bold mb-2" 
            for="email"
          >
            Email:
          </label>
          <input
            v-model="user.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          >
        </div>
        <div class="form-group">
          <label
            class="block text-grey-darker text-sm font-bold mb-2"
            for="password"
          >
            Password:
          </label>
          <input
            v-model="user.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            type="password"
          >
        </div>
        <button
          class="loginButton"
          type="submit"
        >
          ログイン
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  // すでにログイン中の場合、ルートページにリダイレクトする。
  middleware ({ store, redirect }) {
    const localAuthToken = localStorage.getItem('auth._token.local')
    if (localAuthToken == null && localAuthToken !== 'false') {
      redirect('/')
    }
  },
  data () {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    // ログイン処理
    loginUser () {
      this.$auth.loginWith('local', {
        data: this.user
      })
    }
  }
}
</script>

<style>
/** ログインボタンのデザイン */
.loginButton {
  @apply font-bold py-2 px-4 rounded;
  @apply bg-blue-500 text-white;
}
</style>
