// Real WebSocket client wrapper connecting to backend WebSocket server
type MessageHandler = (data: any) => void;

const DEFAULT_WS_PORT = import.meta.env.VITE_WS_PORT || '5000';
const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:${DEFAULT_WS_PORT}`;

class RealWebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimeout = 3000;

  constructor(url?: string) {
    this.url = url || DEFAULT_WS_URL;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(this.url);
    } catch (err) {
      console.error('[WS] Failed to create WebSocket:', err);
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log('[WS] Connected to', this.url);
    };

    this.ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        this.handlers.forEach(h => h(data));
      } catch (err) {
        console.error('[WS] Error parsing message', err);
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected from', this.url);
      this.ws = null;
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error', err);
    };
  }

  private scheduleReconnect() {
    setTimeout(() => this.connect(), this.reconnectTimeout);
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    // Auto-connect when first subscriber appears
    if (!this.ws) this.connect();
  }

  unsubscribe(handler: MessageHandler) {
    this.handlers.delete(handler);
    // Optionally close connection if no handlers
    if (this.handlers.size === 0 && this.ws) {
      this.ws.close();
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) this.ws.close();
    this.ws = null;
  }

  getConnectionStatus() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocket = new RealWebSocketClient();
