import { CircleX } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { getInvitation } from './../../../services/firebaseService';
import { ProfileContext } from '../Context/ProfileCotext';
import RequestConnect from '../../../model/RequestConnect';

function Notification({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<'sent' | 'received'>('sent');
    const { profileInfor } = useContext(ProfileContext)!;
    const [listConnect, setListConnect] = useState<RequestConnect[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const listConnect = await getInvitation(
                profileInfor?.username!,
                'people',
                tab === 'sent' ? 'sent_requests' : 'invitations',
            );
            console.log('listConnect', listConnect);
            setListConnect(listConnect);
        };
        fetchNotifications();
    }, [tab]);

    return (
        <div className="flex justify-center  items-center fixed inset-0 bg-black/40 z-50">
            <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-200 w-96 h-64">
                <div className="flex justify-between w-full">
                    <p className="font-semibold text-md">Lời mời nhóm và kết bạn</p>
                    <CircleX className="cursor-pointer" color="gray" onClick={onClose} />
                </div>
                <div className="flex justify-around items-center mx-2 mt-3 w-full h-8 rounded-2xl bg-gray-100 relative">
                    <p className="font-semibold text-sm text-black z-10 cursor-pointer" onClick={() => setTab('sent')}>
                        Đã Gửi{' '}
                    </p>
                    <p
                        className="font-semibold text-sm text-black z-10 cursor-pointer"
                        onClick={() => setTab('received')}
                    >
                        Đã nhận{' '}
                    </p>
                    <div
                        className={`absolute top-0 left-0 w-1/2 h-8 bg-slate-200 rounded-2xl  transition-all duration-300 ease-out ${
                            tab === 'sent' ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    ></div>
                </div>

                <div className="w-full flex flex-col gap-2 mt-2">
                    {listConnect.length === 0 ? (
                        <p className="text-center text-gray-500">Không có thông báo nào</p>
                    ) : (
                        listConnect.map((connect) => {
                            return (
                                <div className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-100">
                                    <div className="flex gap-3 items-center ">
                                        <img
                                            src={
                                                connect.imageUrl ||
                                                'https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220'
                                            }
                                            alt={connect.username}
                                            className="w-9 h-9 rounded-full object-cover"
                                        />
                                        <p className="text-[#85d712] font-medium text-sm ">{connect.username}</p>
                                    </div>
                                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                        {connect.status === 'pending'
                                            ? 'Chấp nhận'
                                            : connect.status === 'connected'
                                            ? 'Đã chấp nhận'
                                            : connect.status === 'rejected'
                                            ? 'Đã từ chối'
                                            : 'Đã hủy'}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
export { Notification };
