import { WSMessage } from '../model/WSMessage';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../redux/store';
import { setReCode } from '../redux/userReducer';
import { SOCKET_BASE_URL } from '../config/utils';
import { ReCodeInterface } from '../model/User';
class WebSocketManager {
    private static webSocketManager: WebSocketManager;

    private socket: WebSocket | null = null;

    private listeners: Map<string, (msg: WSMessage) => void> = new Map();
    private intentionalClose = false;
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
                this.intentionalClose = false;
                resolve();
            };

            this.socket.onmessage = (e) => {
                this.listeners.forEach((cb) => cb(JSON.parse(e.data)));
            };

            this.socket.onerror = (err) => {
                console.log('lỗi:', err);
            };
            this.socket.onclose = () => {
                console.log('đóng kết nối');
                this.handleReconnect();
            };
        });
    }
    private reconnecting = false;

    private handleReconnect() {
        console.log('handle reconnect');
        if (this.reconnecting) return;
        this.reconnecting = true;

        this.connect2(SOCKET_BASE_URL)
            .then(() => {
                this.reconnecting = false;
                this.reCode();
            })
            .catch(() => {
                this.reconnecting = false;
            });
    }

    public reCode() {
        // this.unSubcribe('RE_LOGIN');
        console.log('dis connet rồi');
        this.unSubcribe('RE_LOGIN_MANGAGER');
        this.onMessage('RE_LOGIN', (mes: any) => {
            console.log('re code trong ws', mes);
            const objReCode: ReCodeInterface = mes.data;
            console.log('objReCode', objReCode);
            console.log('re code nhan', mes);
            if (mes.event === 'RE_LOGIN' && mes.status === 'success') {
                console.log('lưu vào local storage vs code: ', objReCode.RE_LOGIN_CODE);
                store.dispatch(setReCode({ reCode: objReCode.RE_LOGIN_CODE }));
            }
            if (mes.status === 'error') {
                window.location.href = '/login';
            }
        });
        const us = localStorage.getItem('username');
        const reC = localStorage.getItem('reCode');
        if (!us || !reC) return;
        this.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'RE_LOGIN',
                    data: {
                        user: localStorage.getItem('username'),
                        code: localStorage.getItem('reCode'),
                    },
                },
            }),
        );
    }
    public onMessage(event: string, cb: (msg: WSMessage) => void) {
        this.listeners.set(event, cb);
    }
    public async sendMessage(message: string): Promise<void> {
        console.log(message);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            try {
                await this.connect2(SOCKET_BASE_URL);
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    console.log('Gửi message sau khi reconnect thành công');
                    this.reCode();
                    setTimeout(() => {
                        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                            this.socket.send(message);
                            console.log('Gửi message sau khi auth thành công');
                        }
                    }, 1000);
                }
            } catch (err) {
                console.error('Reconnect thất bại, không gửi được message', err);
            }
        }
    }
    public disconnect(): void {
        console.log('đã bị đóng connect');
        if (!this.socket) return;
        this.intentionalClose = true;
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
