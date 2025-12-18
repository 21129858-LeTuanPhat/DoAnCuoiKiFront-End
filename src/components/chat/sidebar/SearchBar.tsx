import { Search } from 'lucide-react';
import { User } from '../../../model/User';
import { useState } from 'react';

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
    const [users, setUsers] = useState<User[]>([]);

    const handleSearch = (value: string) => {
        setKeyword(value);

        // Demo data
        setUsers([
            { id: '1', name: 'Nguyễn Văn A', type: 0 },
            { id: '2', name: 'Trần Thị B', type: 0 },
        ]);
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

                {/* Search input */}
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Nhập tên hoặc email..."
                    className="
            w-full px-4 py-2 mb-3
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
                />

                {/* Result list */}
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
