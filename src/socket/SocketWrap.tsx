import { useEffect } from 'react';
import WebSocketManager from './WebSocketManager';

interface SocketWrapProps {
    children: React.ReactElement;
}

function SocketWrap({ children }: SocketWrapProps) {
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        ws.connect('wss://chat.longapp.site/chat/chat');
        return () => {
            ws.disconnect();
        };
    }, []);

    return <>{children}</>;
}

export default SocketWrap;
