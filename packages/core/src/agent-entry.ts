import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './agent-panel';
import { Agent } from './agent-panel';

const STORAGE_KEY = 'agent-component-hidden-date';

@customElement('agent-entry')
export class AgentEntry extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
    }

    :host([hidden]) {
      display: none !important;
    }

    .trigger {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px 0 0 8px;
      padding: 10px 4px;
      box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      writing-mode: vertical-rl;
      color: white;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 2px;
    }

    .trigger:hover {
      padding-right: 8px;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .trigger-icon {
      font-size: 20px;
      margin-bottom: 6px;
    }

    .panel-container {
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      margin-right: 12px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }

    .panel-container.open {
      opacity: 1;
      visibility: visible;
    }
  `;

  @property({ type: Array })
  agents: Agent[] = [];

  @property({ type: String })
  apiUrl = '';

  @property({ type: String })
  phone = '400-XXX-XXXX';

  @property({ type: Number })
  hoverDelay = 200;

  @property({ type: String })
  triggerText = 'AI助手';

  @state()
  private _isOpen = false;

  @state()
  private _loading = false;

  @state()
  private _fetchedAgents: Agent[] = [];

  private _hoverTimeout: number | null = null;
  private _hasFetched = false;

  connectedCallback() {
    super.connectedCallback();
    this._checkHiddenStatus();
  }

  private _checkHiddenStatus() {
    const hiddenDate = localStorage.getItem(STORAGE_KEY);
    if (hiddenDate) {
      const today = new Date().toDateString();
      if (hiddenDate === today) {
        this.hidden = true;
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  private async _fetchAgents() {
    if (!this.apiUrl || this._hasFetched) return;

    this._loading = true;
    this._hasFetched = true;

    try {
      const response = await fetch(this.apiUrl);
      if (response.ok) {
        const data = await response.json();
        this._fetchedAgents = Array.isArray(data) ? data : [];
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      this._loading = false;
    }
  }

  private _getAgentList(): Agent[] {
    return this.agents.length > 0 ? this.agents : this._fetchedAgents;
  }

  private _handleMouseEnter() {
    if (this._hoverTimeout) window.clearTimeout(this._hoverTimeout);
    this._isOpen = true;

    if (this.apiUrl && !this._hasFetched) {
      this._fetchAgents();
    }
  }

  private _handleMouseLeave() {
    if (this._hoverTimeout) window.clearTimeout(this._hoverTimeout);
    this._hoverTimeout = window.setTimeout(() => {
      this._isOpen = false;
    }, this.hoverDelay);
  }

  private _handlePanelClose() {
    this._isOpen = false;
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, today);
    this.hidden = true;

    this.dispatchEvent(new CustomEvent('component-closed', {
      bubbles: true,
      composed: true
    }));
  }

  private _handleAgentSelected() {
    this._isOpen = false;
  }

  render() {
    const agentList = this._getAgentList();

    return html`
      <div 
        class="trigger"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <slot name="trigger">
          <span class="trigger-icon">🤖</span>
          <span>${this.triggerText}</span>
        </slot>
      </div>

      <div 
        class="panel-container ${this._isOpen ? 'open' : ''}"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <agent-panel
          .agents=${agentList}
          .phone=${this.phone}
          .loading=${this._loading}
          @close-panel=${this._handlePanelClose}
          @agent-selected=${this._handleAgentSelected}
        ></agent-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agent-entry': AgentEntry;
  }
}
