import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import '@gray0128/agent-component-core';
import type { Agent } from '@gray0128/agent-component-core';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'agent-entry': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                phone?: string;
                hoverDelay?: number;
                apiUrl?: string;
                triggerText?: string;
                storageKey?: string;
                autoHide?: boolean;
            };
        }
    }
}

export interface AgentComponentProps {
    agents?: Agent[];
    apiUrl?: string;
    phone?: string;
    hoverDelay?: number;
    triggerText?: string;
    autoHide?: boolean;
    storageKey?: string;
    onAgentSelected?: (agent: Agent) => void;
    onComponentClosed?: () => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const AgentComponent = forwardRef<HTMLElement, AgentComponentProps>(({
    agents,
    apiUrl,
    phone,
    hoverDelay,
    triggerText,
    autoHide,
    storageKey,
    onAgentSelected,
    onComponentClosed,
    children,
    className,
    style
}, ref) => {
    const elementRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => elementRef.current!);

    useEffect(() => {
        if (elementRef.current && agents) {
            (elementRef.current as any).agents = agents;
        }
    }, [agents]);

    useEffect(() => {
        if (elementRef.current) {
            const el = elementRef.current as any;
            if (apiUrl !== undefined) el.apiUrl = apiUrl;
            if (autoHide !== undefined) el.autoHide = autoHide;
        }
    }, [apiUrl, autoHide]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleSelected = (e: Event) => {
            const customEvent = e as CustomEvent;
            onAgentSelected?.(customEvent.detail);
        };

        const handleClosed = () => {
            onComponentClosed?.();
        };

        element.addEventListener('agent-selected', handleSelected);
        element.addEventListener('component-closed', handleClosed);

        return () => {
            element.removeEventListener('agent-selected', handleSelected);
            element.removeEventListener('component-closed', handleClosed);
        };
    }, [onAgentSelected, onComponentClosed]);

    return (
        <agent-entry
            ref = { elementRef }
    phone = { phone }
    hoverDelay = { hoverDelay }
    triggerText = { triggerText }
    autoHide = { autoHide }
    storageKey = { storageKey }
    class={ className }
    style = { style }
        >
        { children && <div slot="trigger" > { children } </div>
}
        </agent-entry>
);
});

AgentComponent.displayName = 'AgentComponent';
export default AgentComponent;
