/**
 * localstorage にトークンが登録されているか確認する。
 */
export default function ({ store, route, redirect }) {
  if (route.fullPath !== '/login') {
    const tokenLocal = localStorage.getItem('auth._token.local')

    if (tokenLocal === 'false') {
      try {
        return redirect('/login')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
