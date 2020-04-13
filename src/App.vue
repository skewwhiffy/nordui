<template>
  <div id="app">
    <Status :status="status" />
    <Connector :status="status" />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import Status from './components/Status.vue';
import Connector from './components/Connector.vue';
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
    Connector
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
