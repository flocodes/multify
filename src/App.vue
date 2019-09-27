<template>
    <div id="app">
      <div class="flex-container my-5" id="logo-container">
        <div id="logo-left"></div>
        <img src="./assets/logo.jpg" alt="multify">
        <div id="logo-right"></div>
      </div>
      <Container v-if="connected"/>
      <Connect v-else/>
      <div class="flex-container my-3" id="hline-container">
        <div id="hline-left"></div>
        <img src="./assets/hlines/hline4.png">
        <div id="hline-right"></div>
      </div>
      <div class="container mb-3">
        <small>MULTIFY is an <a href="https://github.com/TODO">open source app</a> which runs completely in your browser. We do not store any of your data.</small>
      </div>
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
.flex-container {
  display: flex;
}
.flex-container > div {
  flex: 1;
  background-repeat: repeat-x;
}
.flex-container > img {
  max-width: 100%;
  display: block;
}
#logo-container > div {
  background-size: auto 100px;
}
#logo-left {
  background-image: url("./assets/logo-left.jpg");
}
#logo-container > img {
  max-height: 100px;
}
#logo-right {
  background-image: url("./assets/logo-right.jpg");
}
#hline-container > div {
  background-size: auto 20px;
}
#hline-left {
  background-image: url("./assets/hlines/hline4-left.png");
}
#hline-container > img {
  max-height: 20px;
}
#hline-right {
  background-image: url("./assets/hlines/hline4-right.png");
}
</style>
