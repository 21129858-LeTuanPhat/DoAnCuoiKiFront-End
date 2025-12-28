import { CircleX, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProfileForm from '../../../model/ProfileForm';
import { getUserProfile, getInforGroup } from '../../../services/firebaseService';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import InforGroup from '../../../model/InforGroup';
import { formatDate } from '../../../config/utils';
import { ResponseStatus } from '../../../model/RequestConnect';
import { useBoardContext } from '../../../hooks/useBoardContext';
export function ViewInforProfile({
    onClose,
    onCloseNotification,
    username,
    type,
    status,
}: {
    onClose: () => void;
    onCloseNotification: () => void;
    username: string;
    type: string;
    status: ResponseStatus;
}) {
    const [profileInfor, setProfileInfor] = useState<ProfileForm | InforGroup | null>(null);

    const { selectedUser, setSelectedUser, setType } = useBoardContext();

    const handleChat = () => {
        console.log('Start chat with', username);
        setSelectedUser((prev) => (prev === username ? '' : username));
        setType(type);
        onCloseNotification();
    };

    useEffect(() => {
        const fetchProfile = async () => {
            let profileData: ProfileForm | InforGroup | null = null;
            if (type === 'people') {
                profileData = await getUserProfile(username);

                if (!profileData) {
                    profileData = {
                        username: username,
                        fullName: '',
                        address: '',
                        introduce: '',
                    };
                }
            } else if (type === 'room') {
                profileData = await getInforGroup(username);
            }
            setProfileInfor(profileData);
        };

        fetchProfile();
    }, []);

    if (!profileInfor) return <div></div>;

    return (
        <div className="relative bg-black/40  flex flex-col items-center justify-between">
            <div className="flex flex-col bg-white  max-w-md max-h-lg rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    <CircleX className="cursor-pointer" onClick={onClose} />
                </div>

                <div className="flex items-center mt-6 p-10 bg-gradient-to-r from-blue-700 to-pink-400 rounded-xl gap-4">
                    <div className="relative">
                        <img
                            src={
                                profileInfor?.imageUrl ??
                                'https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220'
                            }
                            alt="avatar"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />

                        <div className="absolute right-0 bottom-0 p-2 rounded-full bg-blue-100 cursor-pointer"></div>
                    </div>

                    <div className="flex flex-1 flex-col">
                        <p className="text-white font-semibold text-2xl">{username}</p>
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

                <div className="flex flex-col gap-4 mt-6 shadow-2xl p-4 rounded-2xl border border-gray-200 overflow-y-auto">
                    <div className="flex gap-2 items-center">
                        <Heart color="red" />
                        <p className="font-semibold text-lg">Thông tin chi tiết</p>
                    </div>
                    {type === 'people' ? (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Họ và tên:</span>
                                <span>{(profileInfor as ProfileForm).fullName || 'Chưa cập nhật'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Địa chỉ:</span>
                                <span>{(profileInfor as ProfileForm).address || 'Chưa cập nhật'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Giới thiệu:</span>
                                <span>{(profileInfor as ProfileForm).introduce || 'Chưa cập nhật'}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Tên nhóm:</span>
                                <span>{(profileInfor as InforGroup).name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Admin nhóm:</span>
                                <span>{(profileInfor as InforGroup).adminUsername}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Số thành viên:</span>
                                <span>{(profileInfor as InforGroup).menbersCount}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Mô tả:</span>
                                <span>{(profileInfor as InforGroup).description || 'Chưa cập nhật'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Ngày tạo:</span>
                                <span>{formatDate((profileInfor as InforGroup).createAt)}</span>
                            </div>
                        </>
                    )}
                    {status === 'connected' && (
                        <div className="w-full flex justify-center items-center">
                            <button
                                className="w-64 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={handleChat}
                            >
                                Nhắn tin
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
