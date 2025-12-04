<template>
  <agent-entry
    ref="entry"
    :agents.prop="agents"
    :apiUrl="apiUrl"
    :phone="phone"
    :hoverDelay="hoverDelay"
    :triggerText="triggerText"
    @agent-selected="handleAgentSelected"
    @component-closed="handleComponentClosed"
  >
    <template slot="trigger">
      <slot name="trigger"></slot>
    </template>
  </agent-entry>
</template>

<script>
import '@gray0128/agent-component-core';

export default {
  name: 'AgentComponent',
  props: {
    agents: {
      type: Array,
      default: () => []
    },
    apiUrl: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: '400-XXX-XXXX'
    },
    hoverDelay: {
      type: Number,
      default: 200
    },
    triggerText: {
      type: String,
      default: 'AI助手'
    }
  },
  methods: {
    handleAgentSelected(e) {
      this.$emit('agent-selected', e.detail);
    },
    handleComponentClosed() {
      this.$emit('component-closed');
    }
  }
};
</script>
