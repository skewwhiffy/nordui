<template>
  <div id="app">
    <Status :status="status" />
    <Map />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import Status from './components/Status.vue';
import Map from './components/Map.vue';
import StatusPoller from './foreground/status.poller';
import Waiter from './util/waiter';
import statuses from './enum/status';

const ms = 2000;
const waiter = new Waiter();
const poller = new StatusPoller({ ipcRenderer, ms, waiter });

export default {
  name: 'App',
  components: {
    Status,
    Map
  },
  data() {
    return {
      status: statuses.UNKNOWN
    };
  },
  created() {
    poller.onChange(() => {
      this.status = poller.status;
    });
  },
  beforeDestroy() {
    poller.destroy();
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
