import { useEffect, useState } from 'react';
import WebSocketManager from './WebSocketManager';

interface SocketWrapProps {
    children: React.ReactElement;
}

function SocketWrap({ children }: SocketWrapProps) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        ws.connect2('wss://chat.longapp.site/chat/chat')
            .then(() => {
                ws.sendMessage(
                    JSON.stringify({
                        action: 'onchat',
                        data: {
                            event: 'LOGIN',
                            data: {
                                user: 'phat2',
                                pass: '12345',
                            },
                        },
                    }),
                );
                ws.onMessage('LOGIN', (mes) => {
                    if (mes.status === 'success' && mes.event === 'LOGIN') {
                        setReady(true);
                        ws.unSubcribe('LOGIN');
                    }
                });
            })
            .catch(() => {
                console.error('WS connect failed');
            });
    }, []);

    if (!ready) {
        return <div className="h-screen flex items-center justify-center">Đang kết nối server...</div>;
    }

    return <>{children}</>;
}

export default SocketWrap;
