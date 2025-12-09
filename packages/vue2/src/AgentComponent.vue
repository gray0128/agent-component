<template>
  <agent-entry
    ref="entry"
    :agents.prop="agents"
    :apiUrl="apiUrl"
    :phone="phone"
    :hoverDelay="hoverDelay"
    :triggerText="triggerText"
    :storageKey="storageKey"
    :autoHide="autoHide"
    :iconType="iconType"
    :icon="icon"
    :triggerStyle="triggerStyle"
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
    },
    storageKey: {
      type: String,
      default: undefined
    },
    autoHide: {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      default: 'emoji',
      validator: value => ['emoji', 'image', 'font', 'none'].includes(value)
    },
    icon: {
      type: String,
      default: '🤖'
    },
    triggerStyle: {
      type: String,
      default: ''
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
