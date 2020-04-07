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
      return {
        UNKNOWN: 'Unknown',
        NOT_LOGGED_IN: 'Not logged in',
        NOT_CONNECTED: 'Not connected',
        CONNECTED: 'Connected'
      }[this.status] || 'Not understood';
    }
  },
  created: function() {
    this.component = component.RUNNING;
    const self = this;
    ipcRenderer.on('status-callback', async (event, arg) => {
      self.status = arg;
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
      if (this.component === component.DESTROYED) {
        return;
      }
      ipcRenderer.send('status-get', '');
    }
  }
};
</script>
