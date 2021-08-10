<template>
  <div>
    <p>This is test page.</p>
    <p>
      <nuxt-link to="/">
        トップページへのリンク
      </nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
