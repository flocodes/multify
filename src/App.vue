<template>
  <div class="container" id="app">
    <div class="row justify-content-center my-3" id="logo-container">
      <!-- <div class="col" id="logo-left"></div> -->
      <div class="col-auto" id="logo">
        <img alt="Multify logo" src="./assets/logo.jpg" width=100%>
      </div>
      <!-- <div class="col" id="logo-right"></div> -->
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
@import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

#logo {
  width: 50%;
  height: auto;
}
/*
#logo-left {
  width: 25%;
  height: auto;
  background: url("./assets/logo-left.jpg") repeat-x;
  background-size: auto 100px;
}
#logo-right {
  width: 25%;
  height: auto;
  background: url("./assets/logo-right.jpg") repeat-x;
  background-size: auto 100px;
}
*/
</style>
