import { CircleX, View } from 'lucide-react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getInvitation, changeStatusRoomResponse } from './../../../services/firebaseService';
import { ProfileContext } from '../Context/ProfileCotext';
import WebSocketManager from '../../../socket/WebSocketManager';
import { ResponseStatus } from '../../../model/RequestConnect';

import RequestConnect from '../../../model/RequestConnect';
import { ViewInforProfile } from './ViewInforProfile';
import { avatarDefault } from '../../../config/utils';
import { ListConversationContext } from '../Context/ListConversation';
import { set } from 'firebase/database';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { Member } from '../../../model/Member';

function Notification({ onClose, onCloseProfile }: { onClose: () => void; onCloseProfile: () => void }) {
    const [tab, setTab] = useState<'sent' | 'received'>('sent');
    const { profileInfor } = useContext(ProfileContext)!;
    const [listConnect, setListConnect] = useState<RequestConnect[]>([]);
    const [open, setOpen] = useState(false);
    const usernameSelectedRef = useRef<string | null>(null);
    const typeRef = useRef<string | null>(null);
    const statusRef = useRef<ResponseStatus | null>(null);
    const { setUsers } = useContext(ListConversationContext)!;
    const { setSelectedUser, setType, setListMember } = useBoardContext();

    const handleViewProfile = (username: string, type: string, status: ResponseStatus) => {
        usernameSelectedRef.current = username;
        typeRef.current = type;
        statusRef.current = status;
        console.log('view profile', username, type, status);
        setOpen((prev) => !prev);
    };
    const peopleRequests = useMemo(() => listConnect.filter((item) => item.type === 'people'), [listConnect]);

    const roomRequests = useMemo(() => listConnect.filter((item) => item.type === 'room'), [listConnect]);

    const getStatus = (status: string, type: string): string => {
        switch (status) {
            case 'pending':
                return tab === 'sent' ? 'Đang chờ' : 'Chấp nhận';
            case 'accepted':
                return 'Đã chấp nhận';
            case 'rejected':
                return 'Đã từ chối';
            case 'connected':
                return `Đã ${type === 'people' ? 'kết bạn' : 'tham gia nhóm'}`;
            default:
                return '';
        }
    };
    useEffect(() => {
        const fetchNotifications = async () => {
            const listConnect = await getInvitation(
                profileInfor?.username!,
                'people',
                tab === 'sent' ? 'sent_requests' : 'invitations',
            );

            const listGroupConnect = await getInvitation(
                profileInfor?.username!,
                'room',
                tab === 'sent' ? 'sent_requests' : 'invitations',
            );
            console.log('listConnect', [...listConnect, ...listGroupConnect]);
            setListConnect([...listConnect, ...listGroupConnect]);
        };
        fetchNotifications();
    }, [tab]);
    const webSocket = WebSocketManager.getInstance();
    const handleResponed = async (
        changeStatus: ResponseStatus,
        type: string,
        request: RequestConnect,
        groupName?: string,
    ) => {
        console.log('Responding to request:', request, 'with status:', changeStatus);
        if (request.status !== 'pending') return;
        if (type === 'room') {
            if (changeStatus === 'connected') {
                const ws = WebSocketManager.getInstance();

                ws.sendMessage(
                    JSON.stringify({
                        action: 'onchat',
                        data: {
                            event: 'JOIN_ROOM',
                            data: {
                                name: groupName,
                            },
                        },
                    }),
                );
            }
            setUsers((prev) => [...prev, { id: request.username, name: request.username, type: 1 }]);
            const member: Member = { id: Date.now(), name: request.username };
            console.log('member added to group:', member);
            setSelectedUser(request.username);
            setType('room');
            setListMember((prev) => [...prev, member]);
        } else {
            if (changeStatus === 'connected') {
                webSocket.sendMessage(
                    JSON.stringify({
                        action: 'onchat',
                        data: {
                            event: 'SEND_CHAT',
                            data: {
                                type: 'people',
                                to: request.username,
                                mes: encodeURIComponent(
                                    JSON.stringify({
                                        type: -1,
                                        data: `${profileInfor?.username!} đã chấp nhận lời mời kết bạn.`,
                                    }),
                                ),
                            },
                        },
                    }),
                );

                setUsers((prev) => [...prev, { id: request.username, name: request.username, type: 0 }]);
            }
        }

        await changeStatusRoomResponse({
            type,
            request,
            status: changeStatus,
            username: profileInfor?.username!,
        });

        setListConnect((prev) =>
            prev.map((item) =>
                item.username === request.username && item.type === request.type
                    ? { ...item, status: changeStatus }
                    : item,
            ),
        );
    };

    return (
        <div className="flex justify-center  items-center fixed inset-0 bg-black/40 z-50">
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 w-96 min-h-64  ">
                <div className="flex justify-between w-full">
                    <p className="font-semibold text-md">Lời mời nhóm và kết bạn</p>
                    <CircleX className="cursor-pointer" color="gray" onClick={onClose} />
                </div>
                <div className="flex justify-around items-center mx-2 my-4 w-full h-8 rounded-2xl bg-gray-100 relative">
                    <p className="font-semibold text-sm text-black z-10 cursor-pointer" onClick={() => setTab('sent')}>
                        Đã Gửi
                    </p>
                    <p
                        className="font-semibold text-sm text-black z-10 cursor-pointer"
                        onClick={() => setTab('received')}
                    >
                        Đã nhận
                    </p>
                    <div
                        className={`absolute top-0 left-0 w-1/2 h-8 bg-slate-200 rounded-2xl  transition-all duration-300 ease-out ${
                            tab === 'sent' ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    ></div>
                </div>

                <div className="w-full flex flex-col gap-4 mt-2">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Kết bạn</h3>

                        {peopleRequests.length === 0 ? (
                            <p className="text-sm text-gray-400">Không có lời mời kết bạn</p>
                        ) : (
                            peopleRequests.map((connect) => (
                                <div
                                    key={`people-${connect.username}`}
                                    className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <div
                                        className="flex gap-3 items-center"
                                        onClick={() => handleViewProfile(connect.username, 'people', connect.status)}
                                    >
                                        <img
                                            src={connect.imageUrl || avatarDefault}
                                            alt={connect.username}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />

                                        <p className="text-[#85d712] font-medium text-sm">{connect.username}</p>
                                    </div>

                                    <button
                                        className={`px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                                            connect.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={connect.status !== 'pending'}
                                        onClick={() => handleResponed('connected', 'people', connect)}
                                    >
                                        {getStatus(connect.status, 'people')}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tham gia nhóm</h3>

                        {roomRequests.length === 0 ? (
                            <p className="text-sm text-gray-400">Không có lời mời tham gia nhóm</p>
                        ) : (
                            roomRequests.map((connect) => (
                                <div
                                    key={`room-${connect.username}`}
                                    className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <div
                                        className="flex gap-3 items-center"
                                        onClick={() => handleViewProfile(connect.username, 'room', connect.status)}
                                    >
                                        <img
                                            src={connect.imageUrl || avatarDefault}
                                            alt={connect.username}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />

                                        <p className="text-[#85d712] font-medium text-sm">{connect.username}</p>
                                    </div>

                                    <button
                                        className={`px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                                            connect.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={connect.status !== 'pending'}
                                        onClick={() => handleResponed('connected', 'room', connect, connect.username)}
                                    >
                                        {getStatus(connect.status, 'room')}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {open && (
                <ViewInforProfile
                    onClose={() => setOpen(false)}
                    onCloseNotification={onCloseProfile}
                    username={usernameSelectedRef.current ?? ''}
                    type={typeRef.current ?? ''}
                    status={statusRef.current ?? 'pending'}
                />
            )}
        </div>
    );
}
export { Notification };
