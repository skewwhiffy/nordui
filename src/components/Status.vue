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
import statuses from '../enum/status';
import Waiter from '../util/waiter.js';
import StatusPoller from '../foreground/status.poller.js';

const component = {
  UNKNOWN: 'UNKNOWN',
  RUNNING: 'RUNNING',
  DESTROYED: 'DESTROYED'
};
let poller = {};

export default {
  name: 'Status',
  data() {
    return {
      component: component.UNKNOWN,
      status: statuses.UNKNOWN
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
    const waiter = new Waiter();
    poller = new StatusPoller({ ipcRenderer, ms: 1000, waiter });
    poller.onChange(() => {
      console.log('Hello mum', poller.status);
      this.status = poller.status;
    });
  },
  beforeDestroy() {
    poller.destroy();
    poller = {};
  }
};
</script>
