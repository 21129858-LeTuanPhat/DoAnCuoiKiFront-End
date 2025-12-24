import WebSocketManager from '../socket/WebSocketManager';
import { ChatMessage } from '../model/ChatMessage';

export function useChatSender({ type, username, user, setListMessage, inputRef, setMessage }: any) {
    const sendMessage = (message: string) => {
        if (message.trim() === '') return;

        const ws = WebSocketManager.getInstance();

        ws.onMessage('SEND_CHAT', (msg: any) => {
            if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
                ws.unSubcribe('SEND_CHAT');
            }
        });

        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type,
                        to: username,
                        mes: encodeURIComponent(message),
                    },
                },
            }),
        );

        setMessage('');
        inputRef.current?.focus();

        const newMessage: ChatMessage = {
            id: 0,
            name: user.username,
            type: 0,
            to: username,
            mes: message,
            createAt: new Date().toISOString(),
        };

        setListMessage((prev: ChatMessage[]) => [...prev, newMessage]);
    };

    return { sendMessage };
}
