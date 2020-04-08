<template>
  <div id="app">
    <Status />
    <Map />
  </div>
</template>

<script>
import Status from './components/Status.vue';
import Map from './components/Map.vue';

export default {
  name: 'App',
  components: {
    Status,
    Map
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
