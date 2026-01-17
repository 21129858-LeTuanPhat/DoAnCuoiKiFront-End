import { CircleX, Heart } from 'lucide-react';
import { use, useContext, useEffect, useState } from 'react';
import ProfileForm from '../../../model/ProfileForm';
import { getUserProfile, getInforGroup, getFriendName } from '../../../services/firebaseService';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import InforGroup from '../../../model/InforGroup';
import { avatarDefault, formatDate } from '../../../config/utils';
import { ResponseStatus } from '../../../model/RequestConnect';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Web } from '@mui/icons-material';
import WebSocketManager from '../../../socket/WebSocketManager';
import { ListConversationContext } from '../Context/ListConversation';
import { User } from '../../../model/User';
import ShareCardModal from './ShareCard';

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
    const [openShareModal, setOpenShareModal] = useState(false);

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
        <div className="absolute inset-0 z-50 bg-black/40  flex flex-col items-center justify-center p-4">
            <div
                className="flex flex-col bg-white  max-w-md max-h-lg rounded-xl shadow-lg p-4         transform transition-all duration-300
        scale-100 opacity-100"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    <CircleX className="cursor-pointer" onClick={onClose} />
                </div>

                <div className="flex items-center mt-6 p-10 bg-gradient-to-r from-blue-700 to-pink-400 rounded-xl gap-4">
                    <div className="relative">
                        <img
                            src={profileInfor?.imageUrl ?? avatarDefault}
                            alt="avatar"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />
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
                    <div className=" flex justify-center gap-3 mt-4">
                        {status === 'connected' && (
                            <>
                                <button
                                    className="flex-1 text-white font-semibold py-2 rounded-lg 
                           bg-gradient-to-r from-blue-500 to-pink-500
                           disabled:opacity-30 disabled:cursor-not-allowed"
                                    onClick={handleChat}
                                >
                                    Nhắn tin
                                </button>

                                {type === 'people' && (
                                    <button
                                        className="flex-1 py-2 rounded-lg bg-green-500 
                               text-white font-semibold"
                                        onClick={() => setOpenShareModal(true)}
                                    >
                                        Chia sẻ
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {openShareModal && (
                    <ShareCardModal
                        onClose={() => setOpenShareModal(false)}
                        sharedName={(profileInfor as ProfileForm).username}
                    />
                )}
            </div>
        </div>
    );
}
