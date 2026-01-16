import { use, useState } from 'react';
import { X } from 'lucide-react';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import WebSocketManager from '../../../../socket/WebSocketManager';
import { User } from '../../../../model/User';
import { ChatMessage } from '../../../../model/ChatMessage';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
interface ModalShareMessProps {
    data: string;
    type: number;
    openModalShare: boolean;
    setOpenModalShare: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalShareMess({ data, type, openModalShare, setOpenModalShare }: ModalShareMessProps) {
    const { userList, selectedUser: userNow, setListMessage } = useBoardContext();
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const user = useSelector((state: RootState) => state.user);
    const toggleUser = (user: User) => {
        setSelectedUsers((prev) => {
            if (prev.some((u) => u.name === user.name)) {
                return prev.filter((u) => u.name !== user.name);
            } else {
                return [...prev, user];
            }
        });
    };
    const sendMessage = (ws: WebSocketManager, username: string, usertype: number) => {
        if (usertype === 0) {
            ws.sendMessage(
                JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'SEND_CHAT',
                        data: {
                            type: 'people',
                            to: username,
                            mes: encodeURIComponent(
                                JSON.stringify({
                                    type,
                                    data,
                                }),
                            ),
                        },
                    },
                }),
            );
        } else if (usertype === 1) {
            ws.sendMessage(
                JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'SEND_CHAT',
                        data: {
                            type: 'room',
                            to: username,
                            mes: encodeURIComponent(
                                JSON.stringify({
                                    type,
                                    data,
                                }),
                            ),
                        },
                    },
                }),
            );
        }
        if (username === userNow) {
            const newMessage: ChatMessage = {
                id: 0,
                name: user.username,
                type: 0,
                to: username,
                mes: {
                    type,
                    data,
                },
                createAt: new Date().toISOString(),
            };
            setListMessage((prev: ChatMessage[]) => [...prev, newMessage]);
        }
    };

    const handleConfirm = () => {
        const ws = WebSocketManager.getInstance();
        for (const user of selectedUsers) {
            sendMessage(ws, user.name, user.type);
        }
        setOpenModalShare(false);
    };

    if (!openModalShare) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="relative z-10 w-[400px] bg-white rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold  flex justify-center items-center">Chia sẻ cho user</h2>
                    <button
                        onClick={() => setOpenModalShare(false)}
                        className=" text-black rounded-full hover:bg-gray-100 text-xl p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {userList.map((user) => (
                        <label
                            key={user.id}
                            className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={selectedUsers.some((u) => u.name === user.name)}
                                onChange={() => toggleUser(user)}
                                className="w-4 h-4 accent-blue-600"
                            />
                            <span className="capitalize">{user.name}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setOpenModalShare(false)}
                        className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={selectedUsers.length === 0}
                        className="px-4 py-2 bg-green-600 text-white rounded  disabled:bg-gray-300 trasition"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalShareMess;
