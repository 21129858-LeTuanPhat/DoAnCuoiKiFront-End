import { WSMessage } from '../model/index';
class WebSocketManager {
    private static webSocketManager: WebSocketManager;

    private socket: WebSocket | null = null;

    private lastMessage: WSMessage | null = null;

    private constructor() {}

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.webSocketManager) {
            WebSocketManager.webSocketManager = new WebSocketManager();
        }
        return WebSocketManager.webSocketManager;
    }

    public connect(url: string): void {
        if (!this.socket) {
            this.socket = new WebSocket(url);
        }
        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };
        this.socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            this.lastMessage = msg;
            console.log('Received message:', msg);
        };
        this.socket.onerror = (err) => {
            console.log('lỗi:', err);
        };
        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.socket = null;
        };
    }

    /**?
     * const ws = WebSocketManager.getInstance();
        ws.connect("ws://localhost:8080/ws");

    setTimeout(() => {
      const msg = ws.getMessage<ChatPayload>();
    
      if (msg?.type === "NEW_MESSAGE") {
        console.log(msg.payload.content);
      }
    }, 1000);
     */
    public getMessage<T = any>(): WSMessage<T> | null {
        return this.lastMessage;
    }

    public sendMessage(message: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.log('WebSocket is not connected.');
        }
    }
}
