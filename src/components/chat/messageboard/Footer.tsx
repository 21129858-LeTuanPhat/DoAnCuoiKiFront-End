import { ImagePlus, Smile, Send } from 'lucide-react';
import HeadlessTippy from '@tippyjs/react/headless';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useRef, useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { ChatMessage } from '../../../model/ChatMessage';
function Footer({ username }: { username: string }) {
    const [message, setMessage] = useState('');
    const { listMessage, setListMessage, type } = useBoardContext();
    const inputRef = useRef<any>(null);
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };
    const handleMessage = (e: any) => {
        setMessage(e.target.value);
    };
    function sendMessage() {
        if (message.trim() === '') return;
        const ws = WebSocketManager.getInstance();
        ws.onMessage('SEND_CHAT', (msg) => {
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
                        type: type,
                        to: username,
                        mes: encodeURIComponent(message),
                    },
                },
            }),
        );
        setMessage('');
        inputRef.current.focus();

        const newMessage: ChatMessage = {
            id: 0,
            name: 'phat2',
            type: 0,
            to: username,
            mes: message,
            createAt: new Date().toISOString(),
        };
        setListMessage((prev) => [...prev, newMessage]);
    }

    const handleSendMessage = () => {
        sendMessage();
    };
    const handleSendMessageKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            sendMessage();
        }
    };

    return (
        <footer className="bg-white h-[65px] rounded-bl-lg ">
            <div className="flex items-center h-full ">
                <div>
                    <ImagePlus className="cursor-pointer mt-2 mb-2 ml-4 mr-8 h-[21.5px]" />
                </div>
                <div
                    className="flex-[5] flex items-center my-1
                     rounded-2xl
                     border-2 border-gray-300
                     transition-colors duration-200 ease-linear
                     focus-within:border-purple-400"
                >
                    <input
                        ref={inputRef}
                        value={message}
                        type="text"
                        placeholder="Soạn tin nhắn ..."
                        className="flex-[8] p-2 border-none outline-none 
                        bg-transparent "
                        onChange={handleMessage}
                        onKeyUp={handleSendMessageKeyUp}
                    />
                    <button className="p-2">
                        <HeadlessTippy
                            interactive
                            render={(attrs) => {
                                return (
                                    <div tabIndex={-1} {...attrs} className="mr-12">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                );
                            }}
                        >
                            <Smile className="cursor-pointer rounded-full hover:bg-purple-400 hover:text-white" />
                        </HeadlessTippy>
                    </button>
                </div>
                <button
                    onClick={handleSendMessage}
                    className="m-2 text-white bg-gradient-to-br from-purple-200 via-pink-400 to-pink-400 p-2 rounded-xl hover:opacity-75"
                >
                    <Send className="cursor-pointer" />
                </button>
            </div>
        </footer>
    );
}

export default Footer;
