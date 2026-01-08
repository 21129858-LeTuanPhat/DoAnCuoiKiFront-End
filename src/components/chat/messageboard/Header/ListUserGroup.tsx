import { X, Crown, User } from 'lucide-react';

interface OpenListUser {
    openPanel: boolean;
    setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

function ListUserGroup({ openPanel, setOpenPanel }: OpenListUser) {
    const leader = {
        id: 1,
        name: 'Nguyễn Văn A',
    };

    const members = [
        { id: 2, name: 'Trần Thị B' },
        { id: 3, name: 'Lê Văn C' },
        { id: 4, name: 'Phạm Thị D' },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="relative z-10 min-w-96 bg-white rounded-lg p-4">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">Danh sách nhóm</h2>
                    <X
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => {
                            setOpenPanel(false);
                        }}
                    />
                </div>

                {/* Trưởng phòng */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Trưởng phòng</p>
                    <ul>
                        <li className="flex items-center gap-2 p-2 rounded bg-yellow-50">
                            <Crown className="text-yellow-500" size={18} />
                            <span className="font-medium">{leader.name}</span>
                        </li>
                    </ul>
                </div>

                {/* Thành viên */}
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Thành viên</p>
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {members.map((m) => (
                            <li key={m.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                                <User size={18} className="text-gray-500" />
                                <span>{m.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ListUserGroup;
