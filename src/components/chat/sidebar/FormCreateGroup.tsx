import { Camera, CircleX } from 'lucide-react';
import React, { use, useRef, useState } from 'react';
function FormCreateGroup({ onClose }: { onClose: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        console.log('Avatar URL:', url);
        setAvatarUrl(url);
    };
    return (
        <div className=" flex justify-center items-center fixed inset-0 z-50 bg-black/40">
            <div className="flex flex-col gap-2 bg-white w-full max-w-md rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">Tạo nhóm trò chuyện</h2>
                    <button onClick={onClose} className="text-gray-500">
                        <CircleX />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-3 items-center justify-center">
                        <div className="relative">
                            <img
                                src={
                                    avatarUrl ??
                                    'https://tse3.mm.bing.net/th/id/OIP.yGZbQOjxXDG_TrUC67FWtwHaGS?pid=Api&P=0&h=220'
                                }
                                alt={'Avatar Group'}
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                            />
                            <div
                                className="absolute right-1 bottom-1 p-2 rounded-full bg-blue-100 cursor-pointer"
                                onClick={() => inputRef.current?.click()}
                            >
                                <Camera size={18} color="#03aeec" />
                            </div>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                    <InputInfor label="Tên nhóm" placeholder="Nhập tên nhóm..." value="" onChange={() => {}} />
                    <InputInfor label="Mô tả nhóm" placeholder="Nhập mô tả nhóm..." value="" onChange={() => {}} />
                </div>

                <div>
                    <label className="text-md font-semibold text-black">Thành viên</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none"
                        placeholder="Gửi lời mời thành viên vào nhóm..."
                    />
                </div>

                <button className="mt-4 py-2 rounded-3xl bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold">
                    Tạo Nhóm
                </button>
            </div>
        </div>
    );
}

function InputInfor({
    label,
    placeholder,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="text-md font-semibold text-black">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none"
                placeholder={placeholder}
            />
        </div>
    );
}

export default FormCreateGroup;
