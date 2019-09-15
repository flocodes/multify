<template>
  <div class="container" id="app">
    <div class="row justify-content-center">
      <div class="col-auto">
        <img alt="Vue logo" src="./assets/logo.png">
      </div>
    </div>
    <Container v-if="connected"/>
    <Connect v-else/>
  </div>
</template>

<script>
import Connect from './components/Connect.vue'
import Container from './components/Container.vue'
import { check_spotify_connection } from './lib/common.js'
export default {
  name: 'app',
  computed: {
    connected: () => {
      return check_spotify_connection()
    }
  },
  components: {
    Connect,
    Container
  }
}
</script>

<style lang='scss'>
@import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
</style>
