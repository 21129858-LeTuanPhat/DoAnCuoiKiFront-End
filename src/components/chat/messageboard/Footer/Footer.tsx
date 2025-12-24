//Lucide
import { ImagePlus, Smile, Send, X } from 'lucide-react';
//Tippy
import HeadlessTippy from '@tippyjs/react/headless';
//Emoji-picker
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
//FilePond

import { useRef, useState } from 'react';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useChatSender } from '../../../../hooks/useChatSender';

import PopUp from '../Footer/PopUp';

function Footer({ username }: { username: string }) {
    const MAX_SIZE = 20 * 1024;
    const [files, setFiles] = useState<any[]>([]);

    const [message, setMessage] = useState('');
    const { listMessage, setListMessage, type } = useBoardContext();
    const inputRef = useRef<any>(null);
    const user = useSelector((state: RootState) => state.user);
    const [popUp, setPopUp] = useState<boolean>(false);

    const handleClosePupUp = () => {
        setPopUp(false);
        setFiles([]);
    };
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };
    const handleMessage = (e: any) => {
        setMessage(e.target.value);
    };
    const { sendMessage } = useChatSender({
        type,
        username,
        user,
        setListMessage,
        inputRef,
        setMessage,
    });

    const handleSendMessage = () => {
        sendMessage(message);
    };
    const handleSendMessageKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            sendMessage(message);
        }
    };

    return (
        <footer className="bg-white h-[65px] rounded-bl-lg ">
            <div className="flex items-center h-full ">
                <div>
                    <ImagePlus
                        onClick={() => setPopUp(true)}
                        className="cursor-pointer mt-2 mb-2 ml-4 mr-8 h-[21.5px]"
                    />
                    {popUp && <PopUp onClose={handleClosePupUp} setFiles={setFiles} files={files} />}
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
