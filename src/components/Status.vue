<template>
  <div class="status">
    <h1>Status</h1>
    <p>{{ status }}</p>
  </div>
</template>

<script>
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
  }
};
</script>
