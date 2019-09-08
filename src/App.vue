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
      if (localStorage.access_token) {
        console.log("I'm in! " + localStorage.access_token)
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
