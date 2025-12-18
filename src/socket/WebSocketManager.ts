import { WSMessage } from '../model/WSMessage';
class WebSocketManager {
    private static webSocketManager: WebSocketManager;

    private socket: WebSocket | null = null;

    private listeners: ((msg: WSMessage) => void)[] = [];

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
            try {
                const msg = JSON.parse(event.data) as WSMessage;
                this.listeners.forEach((cb) => cb(msg));
            } catch {
                console.error('Invalid WS message', event.data);
            }
        };
        this.socket.onerror = (err) => {
            console.log('lỗi:', err);
        };
        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.socket = null;
        };
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
            this.socket.onmessage = (e) => this.listeners.forEach((cb) => cb(JSON.parse(e.data)));
        });
        
    }

    public onMessage(cb: (msg: WSMessage) => void) {
        this.listeners.push(cb);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== cb);
        };
    }

    public sendMessage(message: string): void {
        console.log('Sending message:', message);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.log('WebSocket is not connected.');
        }
    }
}
export default WebSocketManager;

/*
const ws = WebSocketManager.getInstance();
ws.connect("ws://localhost:8080/ws");

const off = ws.onMessage((msg) => {
    if (msg.status === 'success' && msg.event === 'REGISTER') {
        TS biết msg.data là string
        console.log(msg.data);
    }

    if (msg.status === 'success' && msg.event === 'LOGIN') {
        console.log(msg.data.RE_LOGIN_CODE);
    }

    if (msg.status === 'error') {
        console.error(msg.mes);
    }
});



useEffect(() => {
    const off = ws.onMessage(msg => {
        if (msg.status === 'success' && msg.event === 'LOGIN') {
            setToken(msg.data.RE_LOGIN_CODE);
        }
    });

    return off; // unsubscribe khi unmount
}, []);


*/
