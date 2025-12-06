import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface Agent {
  id?: string;
  title: string;
  url: string;
  avatar?: string;
  description?: string;
}

@customElement('agent-panel')
export class AgentPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: var(--agent-panel-width, 240px);
      background: var(--agent-panel-bg, #ffffff);
      border-radius: var(--agent-panel-radius, 8px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      font-family: var(--agent-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      color: var(--agent-text-color, #333);
    }

    .header {
      padding: 10px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }

    .list {
      max-height: var(--agent-list-max-height, 280px);
      overflow-y: auto;
    }

    .agent-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid #f0f0f0;
    }

    .agent-item:last-child {
      border-bottom: none;
    }

    .agent-item:hover {
      background-color: var(--agent-item-hover-bg, #f8f9ff);
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 10px;
      object-fit: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 16px;
      flex-shrink: 0;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .title {
      font-size: 13px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .desc {
      font-size: 11px;
      color: #888;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .arrow {
      color: #ccc;
      font-size: 12px;
    }

    .footer {
      border-top: 1px solid #eee;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--agent-footer-bg, #fafafa);
      font-size: 11px;
    }

    .phone {
      color: var(--agent-phone-color, #667eea);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .phone a {
      color: inherit;
      text-decoration: none;
    }

    .phone a:hover {
      text-decoration: underline;
    }

    .close-btn {
      cursor: pointer;
      color: #999;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      color: #666;
      background: #eee;
    }

    .empty {
      padding: 24px 16px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }

    .empty-icon {
      font-size: 32px;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .loading {
      padding: 24px 16px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  `;

  @property({ type: Array })
  agents: Agent[] = [];

  @property({ type: String })
  phone = '400-XXX-XXXX';

  @property({ type: Boolean })
  loading = false;

  private _handleAgentClick(agent: Agent) {
    this.dispatchEvent(new CustomEvent('agent-selected', {
      detail: { ...agent },
      bubbles: true,
      composed: true
    }));
  }

  private _handleClose() {
    this.dispatchEvent(new CustomEvent('close-panel', {
      bubbles: true,
      composed: true
    }));
  }

  private _getDefaultAvatar(title: string) {
    return title ? title.charAt(0) : '🤖';
  }

  render() {
    return html`
      <div class="header">
        <div class="header-title">智能助手</div>
      </div>
      
      <div class="list">
        ${this.loading
        ? html`<div class="loading">加载中...</div>`
        : this.agents.length === 0
          ? html`
              <div class="empty">
                <div class="empty-icon">🤖</div>
                <div>暂无可用助手</div>
              </div>
            `
          : this.agents.map(agent => html`
              <div class="agent-item" @click=${() => this._handleAgentClick(agent)}>
                <div class="avatar">
                  ${agent.avatar
              ? html`<img src="${agent.avatar}" alt="${agent.title}" />`
              : this._getDefaultAvatar(agent.title)
            }
                </div>
                <div class="info">
                  <div class="title">${agent.title}</div>
                  ${agent.description ? html`<div class="desc">${agent.description}</div>` : ''}
                </div>
                <span class="arrow">›</span>
              </div>
            `)
      }
      </div>
      
      <div class="footer">
        <div class="phone">
          <a href="tel:${this.phone}">${this.phone}</a>
        </div>
        <div class="close-btn" @click=${this._handleClose}>
          <span>✕</span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agent-panel': AgentPanel;
  }
}
