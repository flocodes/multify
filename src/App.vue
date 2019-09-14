<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Container v-if="connected"/>
    <Connect v-else/>
  </div>
</template>

<script>
import Connect from './components/Connect.vue'
import Container from './components/Container.vue'

export default {
  name: 'app',
  computed: {
    connected: function () {
      let expiration_date = new Date(localStorage.expiration_date)
      if (localStorage.access_token && (new Date() < expiration_date)) {
        return true
      }
      console.log("Need to log in first.")
      return false
    }
  },
  components: {
    Connect,
    Container
  }
}
</script>

<style lang='scss'>
@import '../primitive/dist/css/main.min.css';
</style>
