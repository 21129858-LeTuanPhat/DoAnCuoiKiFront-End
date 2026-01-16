import { useEffect, useState } from 'react';
import ProfileForm from '../../../../model/ProfileForm';
import {
    getUserProfile,
    checkIsFriend,
    sendConnectRequest,
    acceptedConnectRequest,
} from '../../../../services/firebaseService';
import { avatarDefault } from '../../../../config/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import WebSocketManager from '../../../../socket/WebSocketManager';
import { useBoardContext } from '../../../../hooks/useBoardContext';

export default function CardItem({ data }: { data: any }) {
    const sharedName = data.sharedName;
    const [profile, setProfile] = useState<ProfileForm | null>(null);
    const user = useSelector((state: RootState) => state.user);
    const [statusFriend, setStatusFriend] = useState<string>('none');
    const { setSelectedUser, setType } = useBoardContext();
    useEffect(() => {
        const fetchProfiles = async () => {
            console.log('Fetch profiles...');
            let profile = await getUserProfile(sharedName);
            const status = await checkIsFriend(user.username!, sharedName);
            if (!profile) {
                profile = {
                    username: user.username!,
                    fullName: '',
                    address: '',
                    introduce: '',
                };
            }
            setStatusFriend(status);

            setProfile(profile);
        };
        fetchProfiles();
    }, [sharedName, user.username]);

    const handleRequest = async () => {
        if (statusFriend === 'connected' || statusFriend === 'pending') return;
        if (statusFriend === 'none') {
            await sendConnectRequest(
                WebSocketManager.getInstance(),
                user.username!,
                sharedName,
                profile?.imageUrl ?? null,
            );
            setStatusFriend('pending');
        } else {
            await acceptedConnectRequest(
                WebSocketManager.getInstance(),
                user.username!,
                sharedName,
                profile?.imageUrl ?? null,
            );
            setStatusFriend('connected');
        }
    };

    const handleSelectedUser = () => {
        setSelectedUser(sharedName);
        setType('people');
    };
    return (
        <div className="w-64 rounded-xl overflow-hidden bg-white shadow-lg select-none">
            <div className="relative h-32 bg-gradient-to-br from-blue-600 to-blue-500">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 select-none">
                    <img
                        src={profile?.imageUrl || avatarDefault}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <span className="text-white font-semibold text-lg">{sharedName}</span>
                </div>
            </div>

            <div className="flex items-center justify-between h-14">
                {statusFriend === 'connected' ? (
                    <>
                        <button className="flex-1 text-center font-medium text-gray-700 hover:bg-gray-50 transition">
                            Gọi Điện
                        </button>

                        <div className="w-px h-6 bg-gray-300" />

                        <button
                            className="flex-1 text-center font-medium text-gray-700 hover:bg-gray-50 transition"
                            onClick={handleSelectedUser}
                        >
                            Nhắn Tin
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="flex-1 text-center font-medium text-gray-700 hover:bg-gray-50 transition"
                            disabled={statusFriend === 'pending'}
                            onClick={handleRequest}
                        >
                            {statusFriend === 'pending'
                                ? 'Đang Gửi'
                                : statusFriend === 'incoming'
                                ? 'Chấp nhận'
                                : 'Kết Bạn'}
                        </button>

                        <div className="w-px h-6 bg-gray-300" />

                        <button
                            className="flex-1 text-center font-medium text-gray-700 hover:bg-gray-50 transition"
                            onClick={handleSelectedUser}
                        >
                            Nhắn Tin
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
