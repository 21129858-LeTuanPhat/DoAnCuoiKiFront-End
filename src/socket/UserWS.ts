import { stringify } from 'querystring';
import { UserLogin, UserRegistry } from '../model/User';
import WebSocketManager from '../socket/WebSocketManager';
import { SOCKET_BASE_URL } from '../config/utils';
export async function loginWS(user: UserLogin): Promise<{
    status: 'success' | 'error';
    message: string;
    username?: string;
    reCode?: string;
}> {
    const ws = WebSocketManager.getInstance();
    await ws.connect2(SOCKET_BASE_URL);

    return new Promise((resolve) => {
        let resolved = false;
        const handler = (msg: any) => {
            if (msg.event !== 'LOGIN') return;
            if (resolved) return;
            resolved = true;

            if (msg.status === 'success') {
                // localStorage.setItem('_RECODE', msg.data.RE_LOGIN_CODE);
                // localStorage.setItem('_USER', JSON.stringify(user));
                resolve({
                    status: 'success',
                    message: 'Đăng nhập thành công',
                    username: user.username,
                    reCode: msg.data.RE_LOGIN_CODE,
                });
            } else {
                if (msg.mes === 'You are already logged in') {
                    resolve({
                        status: 'error',
                        message: 'Tài khoản này đang đăng nhập',
                    });
                } else {
                    resolve({
                        status: 'error',
                        message: 'Sai tên đăng nhập hoặc mật khẩu',
                        
                    });
                }
            }
            ws.unSubcribe('LOGIN');
        };
        ws.onMessage('LOGIN', handler);
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'LOGIN',
                    data: {
                        user: user.username,
                        pass: user.password,
                    },
                },
            }),
        );
    });
}

export async function registryWS(user: UserRegistry): Promise<{
    status: 'success' | 'error';
    message: string;
}> {
    const ws = WebSocketManager.getInstance();
    await ws.connect2(SOCKET_BASE_URL);
    return new Promise((resolve) => {
        let resolved = false;
        const handler = (msg: any) => {
            console.log('msg', msg);
            if (msg.event !== 'REGISTER') return;
            if (resolved) return;
            resolved = true;
            if (msg.status === 'success') {
                resolve({
                    status: 'success',
                    message: 'Đăng kí  tài khoản thành công',
                });
            } else {
                resolve({
                    status: 'error',
                    message: 'Xảy ra lỗi. Tên đăng nhập đã tồn tại',
                });
            }
            ws.unSubcribe('LOGIN');
        };
        ws.onMessage('REGISTER', handler);
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'REGISTER',
                    data: {
                        user: user.username,
                        pass: user.password,
                    },
                },
            }),
        );
    });
}
