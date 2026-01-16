import { WSMessage } from '../model/WSMessage';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../redux/store';
import { setReCode } from '../redux/userReducer';
import { SOCKET_BASE_URL } from '../config/utils';
import { ReCodeInterface } from '../model/User';
import { rejects } from 'assert';
class WebSocketManager {
    private static webSocketManager: WebSocketManager;
    private socket: WebSocket | null = null;
    private listeners: Map<string, (msg: WSMessage) => void> = new Map();
    private intentionalClose = false;
    private constructor() { }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.webSocketManager) {
            WebSocketManager.webSocketManager = new WebSocketManager();
        }
        return WebSocketManager.webSocketManager;
    }
    public connect2(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (
                this.socket &&
                (this.socket.readyState === WebSocket.OPEN ||
                    this.socket.readyState === WebSocket.CONNECTING)
            ) {
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
                // reject(err);

            };
            this.socket.onclose = (err) => {
                console.log("close code:", err.code);
                console.log("reason:", err.reason);
                console.log("wasClean:", err.wasClean);
                console.log('đóng kết nối');
                if (!this.intentionalClose) {

                    this.handleReconnect(err.code);
                }
            };
        });
    }
    private isReconnecting = false;
    private async handleReconnect(code?: number) {
        if (this.isReconnecting) return;
        this.isReconnecting = true;
        let delay = 3000;
        if (code === 1001) delay = 10000; // server restart
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log('executing reconnect');
        try {
            await this.connect2(SOCKET_BASE_URL);
            this.reCode();
        } catch (error) {
            console.log('lỗi trong handleReconnect');
        }
        finally {
            this.isReconnecting = false;
        }
    }

    public reCode() {
        console.log('dis connet rồi');
        this.unSubcribe('RE_LOGIN_MANAGER');
        this.onMessage('RE_LOGIN_MANAGER', (mes: any) => {
            console.log('re code trong ws', mes);
            const objReCode: ReCodeInterface = mes.data;
            console.log('objReCode', objReCode);
            console.log('re code nhan', mes);
            if (mes.event === 'RE_LOGIN' && mes.status === 'success') {
                console.log('lưu vào local storage vs code: ', objReCode.RE_LOGIN_CODE);
                store.dispatch(setReCode({ reCode: objReCode.RE_LOGIN_CODE }));
            }
            if (mes.status === 'error') {
                // window.location.href = '/login';
                console.log('RE_LOGIN failed in WebSocketManager');
            }
        });
        const user = localStorage.getItem('username');
        const code = localStorage.getItem('reCode');
        if (!user || !code) return;
        this.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'RE_LOGIN',
                    data: {
                        user: user,
                        code: code,
                    },
                },
            }),
        );
    }
    public onMessage(event: string, cb: (msg: WSMessage) => void) {
        this.listeners.set(event, cb);
    }
    public async sendMessage(message: string): Promise<void> {
        console.log(message)
        const now = new Date();

        const hours = now.getHours();      // 0 - 23
        const minutes = now.getMinutes();  // 0 - 59
        const seconds = now.getSeconds();  // 0 - 59

        console.log(hours, minutes, seconds);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Gửi message khi socket mở', message);
            this.socket.send(message);
        }
        else {
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
                    }, 1000)
                }
            } catch (err) {
                console.error('Reconnect thất bại, không gửi được message', err);
            }
        }
    }
    public disconnect(): void {
        console.log('đã bị đóng connect')
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
