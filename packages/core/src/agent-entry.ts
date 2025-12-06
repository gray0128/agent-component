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
      z-index: 9999;
    }

    :host([hidden]) {
      display: none !important;
    }

    .trigger {
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px 0 0 8px;
      padding: 10px 4px;
      box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
      transition: background 0.3s ease, padding 0.3s ease;
      writing-mode: vertical-rl;
      color: white;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 2px;
      user-select: none;
      touch-action: none;
    }

    .trigger:active {
      cursor: grabbing;
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
      top: 0%;
      right: 100%;
      transform: translateY(-50%);
      margin-right: 12px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
      /* Ensure panel panel aligns with trigger center visually if needed, 
         but technically trigger is centered in host. 
         Actually, host is fixed, trigger is inside.
         We need to center panel relative to trigger. 
         Trigger height varies.
         Let's keep original transform but we might need to adjust if drag is affecting host top.
      */
      top: 50%; 
    }

    .panel-container.open {
      opacity: 1;
      visibility: visible;
    }

    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
    }

    .confirm-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    .confirm-dialog {
      background: var(--agent-confirm-bg, #fff);
      padding: 24px;
      border-radius: 12px;
      width: 280px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      text-align: center;
      transform: scale(0.9);
      transition: transform 0.2s;
    }

    .confirm-overlay.show .confirm-dialog {
      transform: scale(1);
    }

    .confirm-text {
      color: var(--agent-confirm-text, #333);
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn {
      padding: 8px 20px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .btn-cancel {
      background: #f5f5f5;
      color: #666;
    }

    .btn-confirm {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
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

  @property({ type: String })
  confirmText = '确定要关闭助手吗？关闭后今天将不再显示。';

  @property({ type: Boolean })
  autoHide = false;

  @property({ type: String })
  storageKey = STORAGE_KEY;

  @state()
  private _isOpen = false;

  @state()
  private _loading = false;

  @state()
  private _fetchedAgents: Agent[] = [];

  @state()
  private _showConfirm = false;

  private _hoverTimeout: number | null = null;
  private _hasFetched = false;

  // Drag state
  private _isDragging = false;
  private _dragStartY = 0;
  private _initialTop = 0;
  private _hasMoved = false;

  connectedCallback() {
    super.connectedCallback();
    this._checkHiddenStatus();
    this._addDragListeners();

    // Eager fetch if autoHide is enabled and we have an API URL
    if (this.autoHide && this.apiUrl) {
      this._fetchAgents();
    }
  }

  // Handle visibility updates when properties change
  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    if (changedProperties.has('autoHide') ||
      changedProperties.has('agents') ||
      changedProperties.has('_fetchedAgents') ||
      changedProperties.has('apiUrl')) {
      this._updateVisibility();
    }
  }

  private _updateVisibility() {
    // 1. Check if manually closed by user (highest priority)
    const hiddenDate = localStorage.getItem(this.storageKey);
    if (hiddenDate) {
      const today = new Date().toDateString();
      if (hiddenDate === today) {
        this.hidden = true;
        return;
      } else {
        // Expired, clear it
        localStorage.removeItem(this.storageKey);
      }
    }

    // 2. Check autoHide logic
    if (this.autoHide) {
      const list = this._getAgentList();
      // Hide if list is empty. 
      // Note: If loading, list might be empty. 
      // Decision: Hide while loading if list is empty? Yes, to avoid flicker of empty state.
      // But if we want to show a spinner, we shouldn't hide. 
      // However, this is the ENTRY point. Usually we don't show spinner on the trigger itself before it's hovered?
      // If autoHide is true, we assume user doesn't want to see it unless there IS something.
      this.hidden = list.length === 0;
    } else {
      this.hidden = false;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeDragListeners();
  }

  private _addDragListeners() {
    window.addEventListener('mousemove', this._handleDragMove);
    window.addEventListener('mouseup', this._handleDragEnd);
    window.addEventListener('touchmove', this._handleTouchMove, { passive: false });
    window.addEventListener('touchend', this._handleDragEnd);
  }

  private _removeDragListeners() {
    window.removeEventListener('mousemove', this._handleDragMove);
    window.removeEventListener('mouseup', this._handleDragEnd);
    window.removeEventListener('touchmove', this._handleTouchMove);
    window.removeEventListener('touchend', this._handleDragEnd);
  }

  private _checkHiddenStatus() {
    const hiddenDate = localStorage.getItem(this.storageKey);
    if (hiddenDate) {
      const today = new Date().toDateString();
      if (hiddenDate === today) {
        this.hidden = true;
      } else {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  private async _fetchAgents() {
    if (!this.apiUrl) return;
    if (this._loading) return;

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
    if (this._isDragging) return; // Don't open if dragging
    if (this._hoverTimeout) window.clearTimeout(this._hoverTimeout);
    this._isOpen = true;

    if (this.apiUrl) {
      this._fetchAgents();
    }
  }

  private _handleMouseLeave() {
    if (this._isDragging) return;
    if (this._hoverTimeout) window.clearTimeout(this._hoverTimeout);
    this._hoverTimeout = window.setTimeout(() => {
      this._isOpen = false;
    }, this.hoverDelay);
  }

  private _handlePanelClose() {
    this._isOpen = false;
    this._showConfirm = true;
  }

  private _confirmClose() {
    this._showConfirm = false;
    const today = new Date().toDateString();
    localStorage.setItem(this.storageKey, today);
    this.hidden = true;

    this.dispatchEvent(new CustomEvent('component-closed', {
      bubbles: true,
      composed: true
    }));
  }

  private _cancelClose() {
    this._showConfirm = false;
  }

  private _handleAgentSelected() {
    this._isOpen = false;
  }

  // Drag Handlers
  private _handleDragStart = (e: MouseEvent | TouchEvent) => {
    // Only allow left click for mouse
    if (e instanceof MouseEvent && e.button !== 0) return;

    this._isDragging = true;
    this._hasMoved = false;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    this._dragStartY = clientY;

    // Get current top value
    const style = window.getComputedStyle(this);
    this._initialTop = parseInt(style.top, 10);

    // Disable transition during drag
    this.style.transition = 'none';
  };

  private _handleDragMove = (e: MouseEvent) => {
    if (!this._isDragging) return;
    e.preventDefault();
    this._hasMoved = true;

    const deltaY = e.clientY - this._dragStartY;
    const newTop = this._initialTop + deltaY;

    // Boundary check (optional, keep within viewport)
    const storeHeight = this.offsetHeight;
    const maxTop = window.innerHeight - storeHeight / 2;
    const minTop = storeHeight / 2;

    if (newTop > minTop && newTop < maxTop) {
      this.style.top = `${newTop}px`;
      // Since we are setting top directly, we remove transform: translateY(-50%)
      // Actually the CSS has transform: translateY(-50%), which centers it on the 'top' point.
      // So 'top' is the center point. 
    }
  };

  private _handleTouchMove = (e: TouchEvent) => {
    if (!this._isDragging) return;
    e.preventDefault(); // Prevent scrolling
    this._hasMoved = true;

    const deltaY = e.touches[0].clientY - this._dragStartY;
    const newTop = this._initialTop + deltaY;

    this.style.top = `${newTop}px`;
  };

  private _handleDragEnd = () => {
    if (!this._isDragging) return;
    this._isDragging = false;
    this.style.transition = ''; // Restore transition

    // If we haven't moved significantly, treat as click (though click is handled by separate open logic on hover)
    // Here we rely on hover for opening, so no click handler needed on trigger for opening.
  };

  render() {
    const agentList = this._getAgentList();

    return html`
      <div 
        class="trigger"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @mousedown=${this._handleDragStart}
        @touchstart=${this._handleDragStart}
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

      <div class="confirm-overlay ${this._showConfirm ? 'show' : ''}">
        <div class="confirm-dialog">
          <div class="confirm-text">${this.confirmText}</div>
          <div class="confirm-actions">
            <button class="btn btn-cancel" @click=${this._cancelClose}>取消</button>
            <button class="btn btn-confirm" @click=${this._confirmClose}>确认</button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agent-entry': AgentEntry;
  }
}
