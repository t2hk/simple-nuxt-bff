/**
 * axios のラッパープラグイン
 * header に Authorization を設定する。
 */
import axios from 'axios'

export default function ({ $axios }) {
  $axios.onRequest((config) => {
    axios.defaults.headers.common.Authorization = localStorage.getItem(
      'auth._token.local'
    )

    return config
  })
}
