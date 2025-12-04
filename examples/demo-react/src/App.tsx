import { AgentComponent } from '@gray0128/agent-component-react';

const agents = [
    { title: '智维百事通', url: 'http://10.26.9.88/chat/assistant/1' },
    { title: '设备诊断智能专家', url: 'http://10.26.9.88/chat/flow/2' }
];

function App() {
    const handleSelected = (agent: any) => {
        console.log('Selected in React:', agent);
        if (agent.url) {
            window.open(agent.url, '_blank');
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>React Demo</h1>
            <p>鼠标移到右侧"AI助手"标签查看效果</p>
            <AgentComponent agents={agents} phone="400-000-1111" onAgentSelected={handleSelected} />
        </div>
    );
}

export default App;
