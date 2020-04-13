<template>
  <ul>
    <li v-for="legend in legends" :key="legend">
      <button
        v-if="legend"
      >
        {{ legend }}
      </button>
    </li>
  </ul>
</template>

<script>
import ActionsCalculator from '../foreground/connector.action.calculator';

const actionsCalculator = new ActionsCalculator();

export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    legends() {
      return actionsCalculator.getActions(this.status);
    }
  }
};
</script>
