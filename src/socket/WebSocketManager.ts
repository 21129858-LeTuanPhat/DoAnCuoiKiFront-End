import { WSMessage } from '../model/WSMessage';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../redux/store';
import { setReCode } from '../redux/userReducer';
import { SOCKET_BASE_URL } from '../config/utils';
import { useNavigate } from 'react-router-dom';
class WebSocketManager {
    private static webSocketManager: WebSocketManager;

    private socket: WebSocket | null = null;

    private listeners: Map<string, (msg: WSMessage) => void> = new Map();

    private constructor() {}

    private getUser() {
        return store.getState().user;
    }

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
                this.listeners.forEach((cb) => cb(JSON.parse(e.data)));
            };

            this.socket.onerror = (err) => {
                console.log('lỗi:', err);
            };
            this.socket.onclose = () => {
                this.socket = null;
                console.log('WebSocket disconnected');
                // setTimeout(() => {
                //     this.connect2(SOCKET_BASE_URL).then(() => {
                //         this.reCode();
                //     });
                // }, 500);
                this.connect2(SOCKET_BASE_URL).then(() => {
                    this.reCode();
                });
            };
        });

    }
    public reCode() {
        console.log('dis connet rồi');
        const user = this.getUser();
        this.onMessage('RE_LOGIN', (mes: any) => {
            console.log('re code nhan', mes);
            if (mes.status === 'success') {
                store.dispatch(setReCode({ reCode: mes.data.RE_LOGIN_CODE }))
            }

        })
        this.sendMessage(JSON.stringify({
            action: "onchat",
            data: {
                event: "RE_LOGIN",
                data: {
                    event: 'RE_LOGIN',
                    data: {
                        user: user.username,
                        code: user.reCode,
                    },
                },
            }),
        );
    }
    public onMessage(event: string, cb: (msg: WSMessage) => void) {
        this.listeners.set(event, cb);
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
