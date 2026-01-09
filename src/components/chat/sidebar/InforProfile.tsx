import { CircleX, Camera, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { ProfileContext } from '../Context/ProfileCotext';

import { handleUploadImage } from '../../../services/supabaseService';
import { getUserProfile, handleChangeProfile } from '../../../services/firebaseService';

import ProfileForm from '../../../model/ProfileForm';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import { avatarDefault } from '../../../config/utils';

export function InforProfile({ onClose, username }: { onClose: () => void; username: string }) {
    const { profileInfor } = useContext(ProfileContext)!;
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    return (
        <div className="fixed inset-0 p-2 bg-black/40 animate-in slide-in-from-right-80 duration-300 ease-out flex flex-col items-center justify-between">
            <div className="flex flex-col bg-white w-full max-w-xl h-full rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    <CircleX className="cursor-pointer" onClick={onClose} />
                </div>

                {/* Profile Header */}
                <div className="flex items-center mt-6 p-10 bg-gradient-to-r from-blue-700 to-pink-400 rounded-xl gap-4">
                    <div className="relative">
                        <img
                            src={previewUrl ?? profileInfor?.imageUrl ?? avatarDefault}
                            alt="avatar"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />

                        <div
                            className="absolute right-0 bottom-0 p-2 rounded-full bg-blue-100 cursor-pointer"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Camera size={14} color="#03aeec" />
                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleChangeAvatar}
                        />
                    </div>

                    <div className="flex flex-1 flex-col">
                        <p className="text-white font-semibold text-2xl">{username}</p>
                        <p className="text-gray-300 text-md opacity-70">Xin chào! Đây là trang cá nhân của tôi.</p>
                    </div>

                    <div className="flex items-center">
                        <div className="px-2 py-1 bg-white/30 rounded-3xl cursor-pointer">
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-200" />
                                <p className="text-red-500 text-sm font-medium">Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                <InforProfileDetail imageFile={imageFile} username={username} profileInfor={profileInfor} />
            </div>
        </div>
    );
}

function InforProfileDetail({
    imageFile,
    username,
    profileInfor,
}: {
    imageFile: File | null;
    username: string;
    profileInfor: ProfileForm | null;
}) {
    const [loading, setLoading] = useState(false);
    const [formProfile, setFormProfile] = useState<ProfileForm | null>(null);
    const { setProfileInfor } = useContext(ProfileContext)!;

    const originalProfileRef = useRef<ProfileForm | null>(null);

    useEffect(() => {
        if (!profileInfor) return;

        const data: ProfileForm = {
            username,
            fullName: profileInfor.fullName || '',
            address: profileInfor.address || '',
            introduce: profileInfor.introduce || '',
            imageUrl: profileInfor.imageUrl,
        };

        setFormProfile(data);
        originalProfileRef.current = data;
    }, [profileInfor, username]);

    const isChangeData = () => {
        if (!formProfile || !originalProfileRef.current) return false;
        return JSON.stringify(formProfile) !== JSON.stringify(originalProfileRef.current);
    };

    const handleSaveChangeProfile = async () => {
        if (!isChangeData()) return;

        setLoading(true);
        try {
            let imageUrl = formProfile?.imageUrl;

            if (imageFile) {
                imageUrl = await handleUploadImage(imageFile, 'profile_image');
            }

            await handleChangeProfile({
                profileData: {
                    ...formProfile!,
                    imageUrl,
                },
            });

            setProfileInfor({
                ...formProfile!,
                imageUrl,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingProfileSkeleton />;
    }

    return (
        <div className="flex flex-col gap-4 mt-6 shadow-2xl p-4 rounded-2xl border border-gray-200 overflow-y-auto">
            <div className="flex gap-2 items-center">
                <Heart color="red" />
                <p className="font-semibold text-lg">Thông tin chi tiết</p>
            </div>

            <p className="text-md text-gray-600 opacity-70">
                Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn tại đây
            </p>

            <div className="grid grid-cols-2 gap-4">
                <InputInforProfile
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    value={formProfile?.fullName ?? ''}
                    onChange={(value) => setFormProfile((prev) => ({ ...prev!, fullName: value }))}
                />

                <InputInforProfile
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    value={formProfile?.address ?? ''}
                    onChange={(value) => setFormProfile((prev) => ({ ...prev!, address: value }))}
                />
            </div>

            <label className="text-md font-semibold text-black">Giới thiệu bản thân</label>
            <textarea
                value={formProfile?.introduce ?? ''}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                placeholder="Nhập giới thiệu về bản thân"
                onChange={(e) => setFormProfile((prev) => ({ ...prev!, introduce: e.target.value }))}
            />

            <div className="flex justify-center mt-4">
                <button
                    disabled={!isChangeData()}
                    onClick={handleSaveChangeProfile}
                    className="w-64 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
}

function InputInforProfile({
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
