import { Camera, CircleX, Plus } from 'lucide-react';
import React, { use, useRef, useState } from 'react';
import { handleUploadImage } from '../../../services/supabaseService';
import { createGroup } from '../../../services/firebaseService';
import WebSocketManager from '../../../socket/WebSocketManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import { WSMessage } from '../../../model/WSMessage';

function FormCreateGroup({ onClose }: { onClose: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageFileRef = useRef<File | null>(null);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [memberKeyword, setMemberKeyword] = useState('');
    const [memberError, setMemberError] = useState<string | null>(null);
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.user);

    const handleCheckMember = () => {
        if (memberKeyword.trim() === '') {
            setMemberError('Vui lòng nhập tên người dùng');
            return;
        }
        if (invitedUsers.includes(memberKeyword.trim())) {
            setMemberError('Người dùng đã được thêm');
            return;
        }
        const webSocket = WebSocketManager.getInstance();

        webSocket.onMessage('CHECK_USER_EXIST', (msg: WSMessage) => {
            if (msg.status === 'success' && msg.data.status === true) {
                setInvitedUsers((prev) => [...prev, memberKeyword.trim()]);
                setMemberError(null);
            } else {
                setMemberError('Người dùng không tồn tại');
            }
            setMemberKeyword('');
            webSocket.unSubcribe('CHECK_USER_EXIST');
        });

        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CHECK_USER_EXIST',
                    data: {
                        user: memberKeyword.trim(),
                    },
                },
            }),
        );
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        console.log('Avatar URL:', url);

        imageFileRef.current = file;
        console.log('IMAGE FILE REF1:', imageFileRef.current);

        setAvatarUrl(url);
    };

    const handleCreateGroup = async () => {
        if (groupName.trim() === '') {
            setMemberError('Vui lòng nhập tên nhóm');
            return;
        }
        setLoading(true);
        let uploadedImageUrl = null;
        console.log('IMAGE FILE REF2:', imageFileRef.current);
        if (imageFileRef.current !== null) {
            uploadedImageUrl = await handleUploadImage(imageFileRef.current, 'group_image');
        }
        const ws = WebSocketManager.getInstance();

        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CREATE_ROOM',
                    data: {
                        name: groupName,
                    },
                },
            }),
        );

        await createGroup({
            name: groupName,
            description: groupDescription,
            imageUrl: uploadedImageUrl || undefined,
            adminUsername: user.username!,
            members: invitedUsers,
        });
        setLoading(false);
        onClose();
    };

    if (loading) return <LoadingProfileSkeleton />;

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
                    <InputInfor
                        label="Tên nhóm"
                        placeholder="Nhập tên nhóm..."
                        value={groupName}
                        onChange={(value: string) => setGroupName(value)}
                    />
                    <InputInfor
                        label="Mô tả nhóm"
                        placeholder="Nhập mô tả nhóm..."
                        value={groupDescription}
                        onChange={(value: string) => setGroupDescription(value)}
                    />
                </div>

                <div>
                    <label className="text-md font-semibold text-black">Thành viên</label>

                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={memberKeyword}
                            onChange={(e) => setMemberKeyword(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
                            placeholder="Gửi lời mời thành viên vào nhóm..."
                        />
                        <button
                            type="button"
                            onClick={handleCheckMember}
                            className="flex justify-end items-center px-3 w-10 h-10 rounded-full  bg-blue-500 text-white"
                        >
                            <Plus />
                        </button>
                    </div>

                    {invitedUsers.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                            {invitedUsers.map((u) => (
                                <div key={u} className="flex justify-between items-center px-3 py-2 border rounded-lg">
                                    <span>{u}</span>
                                    <button
                                        type="button"
                                        onClick={() => setInvitedUsers((prev) => prev.filter((item) => item !== u))}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <CircleX size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {memberError && <p className="mt-1 ml-1 text-sm text-red-500">{memberError}</p>}
                </div>

                <button
                    className="mt-4 py-2 rounded-3xl bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold "
                    onClick={handleCreateGroup}
                >
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
