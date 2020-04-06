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
import status from '../enum/status';

const component = {
  UNKNOWN: 'UNKNOWN',
  RUNNING: 'RUNNING',
  DESTROYED: 'DESTROYED'
};
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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
    const self = this;
    ipcRenderer.on('status-callback', async (event, arg) => {
      console.log('Got status callback', event, arg);
      await wait(1000);
      self.getStatus();
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
