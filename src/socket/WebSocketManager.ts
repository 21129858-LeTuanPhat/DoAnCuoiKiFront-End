import { ClockFading } from 'lucide-react';
import { WSMessage } from '../model/WSMessage';
class WebSocketManager {
    private static webSocketManager: WebSocketManager;

    private socket: WebSocket | null = null;

    private listeners: Map<string, (msg: WSMessage) => void> = new Map();
    private constructor() {}

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.webSocketManager) {
            WebSocketManager.webSocketManager = new WebSocketManager();
        }
        return WebSocketManager.webSocketManager;
    }

    public connect2(url: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }
            this.socket = new WebSocket(url);
            this.socket.onopen = () => {
                console.log('WebSocket connected');
                resolve();
            };

            this.socket.onmessage = (e) => {
                console.log('thưc thi');
                this.listeners.forEach((value, key) => {
                    console.log(key);
                });
                this.listeners.forEach((cb) => cb(JSON.parse(e.data)));
            };

            this.socket.onerror = (err) => {
                console.log('lỗi:', err);
            };
            this.socket.onclose = () => {
                console.log('WebSocket disconnected');
                this.socket = null;
            };
        });
    }

    public onMessage(event: string, cb: (msg: WSMessage) => void) {
        // if (this.listeners.get(event)) return;
        // console.log(this.listeners.get(event))
        this.listeners.set(event, cb);
        console.log('onMessage');
        this.listeners.forEach((value, key) => {
            console.log(key);
        });
    }

    public sendMessage(message: string): void {
        console.log('Sending message:', message);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.log('WebSocket is not connected.');
        }
    }
    public disconnect(): void {
        if (!this.socket) return;
        this.socket.close();
        this.socket = null;
    }
    public unSubcribe(event: string) {
        if (this.listeners.get(event)) {
            this.listeners.delete(event);
        }
    }
}
export default WebSocketManager;
