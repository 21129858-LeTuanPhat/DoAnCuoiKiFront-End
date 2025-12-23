import { CircleX } from 'lucide-react';
import { useState } from 'react';

function Notification({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<'sent' | 'received'>('sent');

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
                    <div className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-100">
                        <span>phucabc</span>
                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Hủy
                        </button>
                    </div>

                    <div className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-100">
                        <span>taiabc</span>
                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export { Notification };
