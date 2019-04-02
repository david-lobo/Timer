<template>
  <div id="app">
    <app-home></app-home>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Home from './components/Home.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    appHome: Home
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app > .container {
  width: 300px;
}

.time-text {
    font-size: 3.5em;
}

.digits {
  text-align: center;
}

.digits-divider {
  line-height: 1.25;
}
</style>
