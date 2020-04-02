<template>
  <div class="hello">
    <h1>Status</h1>
    <p>{{ statusMessage }}</p>
  </div>
</template>

<script>
const status = {
  UNKNOWN: 1,
  NOT_LOGGED_IN: 2,
  NOT_CONNECTED: 3,
  CONNECTED: 4
};

export default {
  name: 'Status',
  data() {
    return {
      status: status.UNKNOWN
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
  }
};
</script>
