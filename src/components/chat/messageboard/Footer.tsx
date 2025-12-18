import { ImagePlus, Smile, Send } from 'lucide-react';
import HeadlessTippy from '@tippyjs/react/headless';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
function Footer({ username }: { username: string }) {
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
                <div
                    className="flex-[5] flex items-center my-1
                     rounded-2xl
                     border-2 border-gray-300
                     transition-colors duration-200 ease-linear
                     focus-within:border-purple-400"
                >
                    <input
                        value={message}
                        type="text"
                        placeholder="Soạn tin nhắn ..."
                        className="flex-[8] p-2 border-none outline-none 
                        bg-transparent "
                        onChange={handleMessage}
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
                <button className="m-2 text-white bg-gradient-to-br from-purple-200 via-pink-400 to-pink-400 p-2 rounded-xl">
                    <Send className="cursor-pointer" />
                </button>
            </div>
        </footer>
    );
}

export default Footer;
