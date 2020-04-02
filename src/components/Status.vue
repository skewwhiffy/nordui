<template>
  <div class="hello">
    <h1>Status</h1>
    <p>{{ statusMessage }}</p>
    <p>{{ component }}</p>
    <p>{{ status }}</p>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import util from 'util';

const status = {
  UNKNOWN: 1,
  NOT_LOGGED_IN: 2,
  NOT_CONNECTED: 3,
  CONNECTED: 4
};
const component = {
  UNKNOWN: 1,
  RUNNING: 2,
  DESTROYED: 3
};
const wait = util.promisify(setTimeout);

export default {
  name: 'Status',
  data() {
    return {
      status: status.UNKNOWN,
      component: component.UNKNOWN
    };
  },
  computed: {
    statusMessage() {
      switch (this.status) {
        case status.UNKNOWN:
          return 'Unknown';
        default:
          throw new Error({
            message: `I do not recognise status ${this.status}`
          });
      }
    }
  },
  created: function() {
    this.component = component.RUNNING;
    ipcRenderer.on('status-callback', async (event, arg) => {
      console.log('Got status callback', event, arg);
      await wait(1000);
      this.getStatus();
    });
    this.getStatus();
  },
  beforeDestroy() {
    this.component = component.DESTROYED;
  },
  methods: {
    async getStatus() {
      console.log('get status');
      ipcRenderer.send('status-get', '');
    }
  }
};
</script>
