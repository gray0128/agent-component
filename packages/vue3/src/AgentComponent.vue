<script setup lang="ts">
import { ref, type PropType } from 'vue';
import '@gray0128/agent-component-core';
import type { Agent } from '@gray0128/agent-component-core';

defineProps({
  agents: {
    type: Array as PropType<Agent[]>,
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
    type: String as PropType<'emoji' | 'image' | 'font' | 'none'>,
    default: 'emoji',
    validator: (value: string) => ['emoji', 'image', 'font', 'none'].includes(value)
  },
  icon: {
    type: String,
    default: '🤖'
  },
  triggerStyle: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  (e: 'agent-selected', agent: Agent): void;
  (e: 'component-closed'): void;
}>();

const entryRef = ref<HTMLElement | null>(null);

const handleAgentSelected = (e: Event) => {
  const customEvent = e as CustomEvent;
  emit('agent-selected', customEvent.detail);
};

const handleComponentClosed = () => {
  emit('component-closed');
};
</script>

<template>
  <agent-entry
    ref="entryRef"
    :agents.prop="agents"
    :apiUrl="apiUrl"
    :phone="phone"
    :hoverDelay="hoverDelay"
    :triggerText="triggerText"
    :storageKey.attr="storageKey"
    :autoHide="autoHide"
    :iconType="iconType"
    :icon="icon"
    :triggerStyle="triggerStyle"
    @agent-selected="handleAgentSelected"
    @component-closed="handleComponentClosed"
  >
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
  </agent-entry>
</template>
