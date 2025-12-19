import { Search } from 'lucide-react';
import { User } from '../../../model/User';
import { useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { WSMessage } from '../../../model/WSMessage';

function SearchBar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)} className="p-2 rounded-full hover:bg-gray-200 transition">
                <Search className="text-gray-600" />
            </button>

            {open && <SearchUserModal onClose={() => setOpen(false)} />}
        </>
    );
}

function SearchUserModal({ onClose }: { onClose: () => void }) {
    const [keyword, setKeyword] = useState('');
    const webSocket = WebSocketManager.getInstance();

    const users: User[] = [
        { id: '1', name: 'taiabc', type: 0 },
        { id: '2', name: 'john_doe', type: 0 },
        { id: '3', name: 'jane_smith', type: 0 },
    ];
    const handleSearch = (e: any) => {
        setKeyword(e.target.value);
        webSocket.onMessage((msg: WSMessage) => {
            if (msg.status === 'success') {
                alert('Tìm thấy người dùng!');
            }
        });

        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CHECK_USER',
                    data: {
                        user: 'ti',
                    },
                },
            }),
        );
    };

    const sendInvite = (user: User) => {
        alert(`Đã gửi lời mời nhắn tin tới ${user.name}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">Tìm người dùng</h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>

                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Nhập tên hoặc email..."
                        className="
                        flex-1 px-4 py-2 mb-3
                        border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    />
                    <button className="bg-blue-600  rounded-lg text-white px-4 py-2 mb-3 " onClick={handleSearch}>
                        Search
                    </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100"
                        >
                            <span>{user.name}</span>
                            <button
                                onClick={() => sendInvite(user)}
                                className="
                  px-3 py-1 text-sm
                  bg-blue-500 text-white
                  rounded-lg hover:bg-blue-600
                "
                            >
                                Nhắn tin
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
