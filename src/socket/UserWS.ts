import { stringify } from "querystring";
import { UserLogin } from "../model/User";
import WebSocketManager from "../socket/WebSocketManager";
export async function loginWS(
    user: UserLogin
): Promise<{
    status: 'success' | 'error';
    message: string;
}> {
    const ws = WebSocketManager.getInstance();


    await ws.connect2('wss://chat.longapp.site/chat/chat');

    return new Promise((resolve) => {
        let resolved = false;


        const handler = (msg: any) => {

            if (msg.event !== 'LOGIN') return;

            if (resolved) return;
            resolved = true;

            if (msg.status === 'success') {
                localStorage.setItem('_RECODE', msg.data.RE_LOGIN_CODE);
                localStorage.setItem('_USER', JSON.stringify(user));

                resolve({
                    status: 'success',
                    message: 'Đăng nhập thành công',
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
            })
        );


    });
}

