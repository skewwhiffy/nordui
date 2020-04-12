<template>
  <div class="status">
    <h1>Status</h1>
    <p>here: {{ status }}</p>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import Waiter from '../util/waiter';
import StatusPoller from '../foreground/status.poller';

let poller = {};

export default {
  name: 'Status',
  props: {
    status: {
      type: String,
      required: true
    }
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
      this.status = poller.status;
    });
  },
  beforeDestroy() {
    poller.destroy();
    poller = {};
  }
};
</script>
