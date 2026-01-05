import cameraImg from './../../../assets/img/icon_file/camera.png';
import { useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { XCircle } from 'lucide-react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { handleUploadImage } from '../../../services/supabaseService';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import { create } from 'domain';
import { set } from 'firebase/database';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { createStory } from '../../../services/firebaseService';

function FormCreateStory({ onClose }: { onClose: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.user);

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setContent((prev) => prev + emojiData.emoji);
    };

    const handleCreateStory = async () => {
        if (content.trim() === '') {
            setError('Vui lòng nhập tên nhóm');
            return;
        }
        setLoading(true);
        let uploadedImageUrl = null;
        console.log('IMAGE FILE :', imageFile);
        if (imageFile !== null) {
            uploadedImageUrl = await handleUploadImage(imageFile, 'group_image');
        }

        await createStory({
            imageUrl: uploadedImageUrl,
            content,
            username: user.username!,
        });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="mt-2 w-3/12 p-3 flex flex-col items-center rounded-lg bg-slate-100 relative">
                <div className="flex justify-between p-2 w-full items-center">
                    <h2 className="text-lg font-semibold ">Tạo Story Mới</h2>
                    <XCircle className="cursor-pointer" color="gray" onClick={onClose} />
                </div>

                <SeparatorHorizontal />

                {loading ? (
                    <LoadingProfileSkeleton />
                ) : (
                    <>
                        <div
                            className="p-2 w-full h-48 bg-blue-100 rounded-xl cursor-pointer flex justify-center items-center relative"
                            onClick={() => inputRef.current?.click()}
                        >
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : cameraImg}
                                className="w-full h-full object-cover rounded-xl"
                                alt=""
                            />

                            {selectedEmoji && <span className="absolute top-2 right-2 text-4xl">{selectedEmoji}</span>}
                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleChangeAvatar}
                        />

                        <SeparatorHorizontal />

                        <div className="w-full flex flex-col gap-2 ">
                            <textarea
                                placeholder="Viết gì đó về câu chuyện của bạn..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="">
                                <p className="text-sm text-gray-600 mb-1">Thêm cảm xúc</p>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                                    >
                                        Chọn Emoji
                                    </button>

                                    {showEmojiPicker && (
                                        <XCircle
                                            className="text-gray-400 cursor-pointer"
                                            onClick={() => setShowEmojiPicker(false)}
                                        />
                                    )}
                                </div>

                                {showEmojiPicker && (
                                    <div className="absolute z-50 mt-2 bottom-20 -right-20">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center mt-4">
                                <button
                                    className="w-64 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                    onClick={handleCreateStory}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function SeparatorHorizontal() {
    return <div className="w-full h-[1px] bg-gray-300 my-3 rounded-xl"></div>;
}

export default FormCreateStory;
