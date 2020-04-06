<template>
  <div id="app">
    <Status />
  </div>
</template>

<script>
import Status from './components/Status.vue';
const { ipcRenderer } = require('electron');

export default {
  name: 'App',
  components: {
    Status
  },
  created: function() {
    ipcRenderer.send('poo-message', 'ping');
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
