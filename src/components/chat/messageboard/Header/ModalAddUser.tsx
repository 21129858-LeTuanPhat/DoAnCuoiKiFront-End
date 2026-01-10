import { Search, UserPlus, X, Check } from 'lucide-react';
import { useState } from 'react';
import WebSocketManager from '../../../../socket/WebSocketManager';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { sendInvitation, getInforGroup } from '../../../../services/firebaseService';
interface ModalAddUserProps {
    openAddUser: boolean;
    setOpenAddUser: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalAddUser({ openAddUser, setOpenAddUser }: ModalAddUserProps) {
    const [inputMember, setInputMember] = useState<string>('');
    const [members, setMembers] = useState<string[]>([]);
    const [Error, setError] = useState<string | null>('');
    const { owner, listMember, selectedUser } = useBoardContext();
    const handleAdd = () => {
        if (!inputMember.trim()) {
            setError('Vui lòng nhập tên thành viên');
            return;
        }
        if (inputMember.trim() === owner) {
            setError('Đã có trong nhóm');
            setInputMember('');
            return;
        }
        for (let members of listMember) {
            if (members.name === inputMember.trim()) {
                setError('Đã có trong nhóm');
                setInputMember('');
                return;
            }
        }

        if (members.includes(inputMember.trim())) {
            setError('Thành viên đã được thêm');
            setInputMember('');
            return;
        }

        const webSocket = WebSocketManager.getInstance();

        webSocket.onMessage('CHECK_USER_EXIST', (msg) => {
            if (msg.status === 'success' && msg.data.status === true) {
                setMembers((prev) => [...prev, inputMember.trim()]);
                setInputMember('');
                setError('');
            } else {
                setError('Người dùng không tồn tại');
                setInputMember('');
            }
            webSocket.unSubcribe('CHECK_USER_EXIST');
        });

        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CHECK_USER_EXIST',
                    data: {
                        user: inputMember.trim(),
                    },
                },
            }),
        );
    };

    const handleRemove = (name: string) => {
        setMembers(members.filter((m) => m !== name));
    };
    const handleSendInvite = async () => {
        const groupInfo = await getInforGroup(selectedUser);
        await sendInvitation({
            groupName: selectedUser,
            imageUrl: groupInfo?.imageUrl,
            members: members,
        });
        setOpenAddUser(false);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Thêm thành viên</h2>
                    <button onClick={() => setOpenAddUser(false)} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={18} />
                    </button>
                </div>

                {/* Search + Add */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={inputMember}
                            onChange={(e) => setInputMember(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            type="text"
                            placeholder="Nhập tên thành viên"
                            className="
                                w-full pl-10 pr-3 py-2
                                border border-gray-300 rounded-lg
                                outline-none
                                focus:ring-2 focus:ring-purple-400
                            "
                        />
                    </div>

                    <button
                        onClick={handleAdd}
                        className="
                            flex items-center gap-1
                            px-3 py-2
                            bg-purple-500 text-white
                            rounded-lg
                            hover:bg-purple-600
                            transition
                        "
                    >
                        <UserPlus size={16} />
                        Thêm
                    </button>
                </div>

                <div className="text-center text-2xl text-red-600 mt-2">{Error}</div>

                {/* Danh sách đã thêm */}
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {members.length === 0 && (
                        <p className="text-sm text-gray-400 text-center">Chưa có thành viên nào</p>
                    )}

                    {members.map((name, index) => (
                        <div
                            key={index}
                            className="
                                flex items-center justify-between
                                px-3 py-2
                                border rounded-lg
                                hover:bg-purple-50
                                transition
                            "
                        >
                            <span className="font-medium">{name}</span>
                            <button onClick={() => handleRemove(name)} className="text-gray-400 hover:text-red-500">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => setOpenAddUser(false)}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    >
                        Huỷ
                    </button>

                    <button
                        onClick={handleSendInvite}
                        disabled={members.length === 0}
                        className={`
                            flex items-center gap-1
                            px-4 py-2 rounded-lg
                            text-white
                            transition
                            ${
                                members.length === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                            }
                        `}
                    >
                        <Check size={16} />
                        Xác nhận ({members.length})
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalAddUser;
