import { ImagePlus, Smile, Send } from 'lucide-react';
import HeadlessTippy from '@tippyjs/react/headless';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { useState } from 'react';
function Footer() {
    const [message, setMessage] = useState('');
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };
    const handleMessage = (e: any) => {
        setMessage(e.target.value);
    };
    return (
        <footer className="bg-white h-[65px] rounded-bl-lg ">
            <div className="flex items-center h-full ">
                <div>
                    <ImagePlus className="cursor-pointer mt-2 mb-2 ml-4 mr-8 h-[21.5px]" />
                </div>
                <div className="rounded-2xl border flex-[5] flex items-center my-1">
                    <input
                        value={message}
                        type="text"
                        placeholder="Soạn tin nhắn ..."
                        className="flex-[8] p-2 border-none outline-none 
                        bg-transparent"
                        onChange={handleMessage}
                    />
                    <button className="p-2">
                        <HeadlessTippy
                            interactive
                            render={(attrs) => {
                                return (
                                    <div tabIndex={-1} {...attrs}>
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                );
                            }}
                        >
                            <Smile className="cursor-pointer" />
                        </HeadlessTippy>
                    </button>
                </div>
                <button className="m-2 text-white bg-gradient-to-br from-purple-200 via-pink-400 to-pink-400 p-2 rounded-xl">
                    <Send className="cursor-pointer" />
                </button>
            </div>
        </footer>
    );
}

export default Footer;
