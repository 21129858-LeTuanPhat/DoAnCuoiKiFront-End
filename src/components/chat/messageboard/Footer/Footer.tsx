//Lucide
import { ImagePlus, Smile, Send, FolderUp } from 'lucide-react';
//Tippy
import HeadlessTippy from '@tippyjs/react/headless';
//Emoji-picker
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import { use, useEffect, useRef, useState } from 'react';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useChatSender } from '../../../../hooks/useChatSender';
import PopUp from '../Footer/PopUp';
import { supabaseClient } from '../../../../config/supaBaseConfig';
import { set } from 'firebase/database';

function Footer({ username }: { username: string }) {
    const MAX_SIZE = 20 * 1024;
    const MAX_LENGHT = 350;
    const [files, setFiles] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const { listMessage, setListMessage, type, setRight } = useBoardContext();
    const inputRef = useRef<any>(null);
    const user = useSelector((state: RootState) => state.user);
    const [popUp, setPopUp] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [checkNull, setCheckNull] = useState<boolean>(true);
    const [checkFile, setCheckFile] = useState<boolean>(false);
    const [typeFile, setTypeFile] = useState<number>(0);
    const [checkLimit, setCheckLimit] = useState<boolean>(false);

    useEffect(() => {
        setMessage('');
    }, [username]);

    const handlePopUpFile = () => {
        setPopUp(true);
        setCheckFile(true);
        setTypeFile(2);
    };
    const handlePopUpImage = () => {
        setPopUp(true);
        setCheckFile(false);
        setTypeFile(1);
    };

    const handleSendFile = async () => {
        if (files.length === 0) {
            return;
        }

        const fileToUpload = files[0].file;
        if (fileToUpload.size > MAX_SIZE) {
            // alert('Ảnh vượt quá 20KB');
            return;
        }

        setLoading(true);
        try {
            const fileName = `${Date.now()}-${fileToUpload.name}`;
            const { error } = await supabaseClient.storage
                .from('chat-images')
                .upload(fileName, fileToUpload, { upsert: true });

            if (error) {
                console.error('Upload error:', error);
                // alert('Upload thất bại, thử lại sau.');
                return;
            }

            const { data } = supabaseClient.storage.from('chat-images').getPublicUrl(fileName);
            sendMessage(data.publicUrl, typeFile);
            setTimeout(() => {
                setLoading(false);
                setPopUp(false);
                setFiles([]);
            }, 300);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleClosePupUp = () => {
        setPopUp(false);
        setFiles([]);
    };
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        const nextValue = message + emojiData.emoji;
        const encodedLength = encodeURIComponent(nextValue).length;

        if (encodedLength > MAX_LENGHT) {
            setCheckLimit(true);
            return;
        }

        setCheckLimit(false);
        setMessage(nextValue);
    };
    const handleMessage = (e: any) => {
        const nextValue = e.target.value;
        const encodedLength = encodeURIComponent(nextValue).length;

        if (encodedLength > MAX_LENGHT) {
            setCheckLimit(true);
            return;
        }

        setCheckLimit(false);
        setMessage(nextValue);
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
        if (message.trim().length === 0 || encodeURIComponent(message).length > MAX_LENGHT) {
            return;
        }
        sendMessage(message);
        setRight(true);
        setCheckLimit(false);
    };
    const handleSendMessageKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            if (message.trim().length === 0 || encodeURIComponent(message).length > MAX_LENGHT) {
                return;
            }
            sendMessage(message);
            setRight(true);
            setCheckLimit(false);
        }
    };

    return (
        <footer className="bg-white h-[65px] rounded-bl-lg ">
            <div className="flex items-center h-full ">
                <div className="flex">
                    <ImagePlus onClick={handlePopUpImage} className="cursor-pointer mt-2 mb-2 ml-4 mr-1 h-[21.5px]" />
                    <FolderUp onClick={handlePopUpFile} className="cursor-pointer mt-2 mb-2 ml-4 mr-4 h-[21.5px]" />
                    {popUp && (
                        <PopUp
                            checkFile={checkFile}
                            setCheckNull={setCheckNull}
                            checkNull={checkNull}
                            loading={loading}
                            onClose={handleClosePupUp}
                            setFiles={setFiles}
                            files={files}
                            onClick={handleSendFile}
                        />
                    )}
                </div>
                <div
                    className={
                        checkLimit === true
                            ? 'flex-[5] flex items-center my-1 rounded-2xl border-2 border-red-600 '
                            : 'flex-[5] flex items-center my-1 rounded-2xl border-2 border-gray-300 transition-colors duration-200 ease-linear focus-within:border-purple-400'
                    }
                >
                    <textarea
                        ref={inputRef}
                        value={message}
                        placeholder="Soạn tin nhắn ..."
                        rows={1}
                        className="flex-[8]
                                p-2
                                border-none outline-none
                                bg-transparent
                                resize-none
                                whitespace-pre-wrap
                                break-words
                                 "
                        onChange={handleMessage}
                        onKeyUp={handleSendMessageKeyUp}
                    />
                    <button disabled className="p-2">
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
