# 智能体通用入口组件 (Agent Component)

跨框架的通用智能体入口组件，支持 **Vue 2**, **Vue 3**, **React**。

## 安装

```bash
# Vue 3
npm install @gray0128/agent-component-vue3

# Vue 2
npm install @gray0128/agent-component-vue2

# React
npm install @gray0128/agent-component-react
```

## 使用示例

### Vue 3
```html
<script setup>
import { AgentComponent } from '@gray0128/agent-component-vue3';

const agents = [
  { title: '智维百事通', url: 'http://example.com/chat/1' },
  { title: '设备诊断专家', url: 'http://example.com/chat/2' }
];

const handleSelect = (agent) => {
  window.open(agent.url, '_blank');
};
</script>

<template>
  <AgentComponent 
    :agents="agents" 
    phone="400-000-1111"
    @agent-selected="handleSelect"
  />
</template>
```

### React
```jsx
import { AgentComponent } from '@gray0128/agent-component-react';

function App() {
  const agents = [
    { title: '智维百事通', url: 'http://example.com/chat/1' }
  ];
  
  return (
    <AgentComponent 
      agents={agents} 
      phone="400-000-1111"
      onAgentSelected={(agent) => window.open(agent.url)}
    />
  );
}
```

## API

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|-------|-----|
| `agents` | `Agent[]` | `[]` | 智能体列表 |
| `apiUrl` | `string` | `''` | 接口地址 |
| `phone` | `string` | `'400-XXX-XXXX'` | 客服电话 |
| `triggerText` | `string` | `'AI助手'` | 触发器文字 |

**Agent 类型**：
```typescript
interface Agent {
  title: string;      // 名称
  url: string;        // 跳转URL
  avatar?: string;    // 可选头像
  description?: string;
}
```

### 事件

| Vue 事件 | React 事件 | 说明 |
|---------|-----------|-----|
| `agent-selected` | `onAgentSelected` | 点击智能体 |
| `component-closed` | `onComponentClosed` | 点击关闭 |

## 样式定制

```css
:root {
  --agent-panel-width: 240px;
  --agent-footer-bg: #fafafa;
  --agent-phone-color: #667eea;
}
```