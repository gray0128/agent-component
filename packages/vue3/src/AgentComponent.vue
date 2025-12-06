<script setup lang="ts">
import { ref } from 'vue';
import '@gray0128/agent-component-core';
import type { Agent } from '@gray0128/agent-component-core';

defineProps<{
  agents?: Agent[];
  apiUrl?: string;
  phone?: string;
  hoverDelay?: number;
  triggerText?: string;
  storageKey?: string;
}>();

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
    :agents="agents"
    :apiUrl="apiUrl"
    :phone="phone"
    :hoverDelay="hoverDelay"
    :triggerText="triggerText"
    :storageKey="storageKey"
    @agent-selected="handleAgentSelected"
    @component-closed="handleComponentClosed"
  >
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
  </agent-entry>
</template>
