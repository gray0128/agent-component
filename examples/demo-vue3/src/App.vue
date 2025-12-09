<script setup lang="ts">
import { AgentComponent } from '@gray0128/agent-component-vue3';

const agents = [
  { title: '智维百事通', url: 'http://10.26.9.88/chat/assistant/6ea69023ded24839b86b5b0d474f67b9' },
  { title: '设备诊断智能专家', url: 'http://10.26.9.88/chat/flow/00929f1b56934b8db5476d2cec2de032' },
  { title: '数据运维助理', url: 'http://10.26.9.88/chat/flow/af7ab327c05e4b5d86db5121ca2067de' },
  { title: '动态阈值管家', url: 'http://10.26.9.88/chat/flow/e85af4ba3b8b44e79d53f23bf5c9d964' }
];

const handleSelected = (agent: any) => {
  console.log('Selected agent:', agent);
  if (agent.url) {
    window.open(agent.url, '_blank');
  }
};
</script>

<template>
  <div style="padding: 50px;">
    <h1>Vue 3 Demo</h1>
    <p>鼠标移到右侧"AI助手"标签查看效果</p>
    <AgentComponent 
      :agents="agents" 
      phone="400-000-1111"
      iconType="emoji"
      icon="🚀"
      triggerText="智能助理"
      triggerStyle="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"
      @agent-selected="handleSelected" 
    />
  </div>
</template>
