import { CircleX } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { getInvitation, changeStatusRoomResponse } from './../../../services/firebaseService';
import { ProfileContext } from '../Context/ProfileCotext';
import WebSocketManager from '../../../socket/WebSocketManager';
import { ResponseStatus } from '../../../model/RequestConnect';

import RequestConnect from '../../../model/RequestConnect';

function Notification({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<'sent' | 'received'>('sent');
    const { profileInfor } = useContext(ProfileContext)!;
    const [listConnect, setListConnect] = useState<RequestConnect[]>([]);

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
    const handleResponed = async (changeStatus: ResponseStatus, type: string, request: RequestConnect) => {
        if (request.status !== 'pending') return;

        if (changeStatus === 'connected') {
            const ws = WebSocketManager.getInstance();

            ws.sendMessage(
                JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'JOIN_ROOM',
                        data: {
                            name: profileInfor?.username!,
                        },
                    },
                }),
            );
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
                                    <div className="flex gap-3 items-center">
                                        <img
                                            src={
                                                connect.imageUrl ||
                                                'https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220'
                                            }
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
                                    <div className="flex gap-3 items-center">
                                        <img
                                            src={
                                                connect.imageUrl ||
                                                'https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220'
                                            }
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
                                        onClick={() => handleResponed('connected', 'room', connect)}
                                    >
                                        {getStatus(connect.status, 'room')}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export { Notification };
