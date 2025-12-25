import { Search } from 'lucide-react';
import { User } from '../../../model/User';
import { useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { WSMessage } from '../../../model/WSMessage';
import {
    useChatConnect,
    sendChatInvitation,
    parseChatConnectState,
    changeStatusConnectChat,
} from '../../../hooks/useConnectChat';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

function SearchUserModal({ onClose }: { onClose: () => void }) {
    const [keyword, setKeyword] = useState('');
    const webSocket = WebSocketManager.getInstance();
    const [targetUser, setTargetUser] = useState<string | undefined | null>(undefined);
    const user = useSelector((state: RootState) => state.user);
    const connectChatState = useChatConnect(user.username, targetUser || null);
    const { setSelectedUser, setType } = useBoardContext();

    const handleSearch = () => {
        console.log('Searching for:', keyword);
        if (!keyword.trim()) return;

        webSocket.onMessage('CHECK_USER_EXIST', (msg: WSMessage) => {
            if (msg.status === 'success' && msg.data.status === true) {
                setTargetUser(keyword);
            } else {
                setTargetUser(null);
            }
            webSocket.unSubcribe('CHECK_USER_EXIST');
        });

        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CHECK_USER_EXIST',
                    data: {
                        user: keyword,
                    },
                },
            }),
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">Tìm người dùng</h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>

                <div className="flex gap-2 mb-2 items-center">
                    <input
                        type="text"
                        placeholder="Nhập tên hoặc email..."
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                        className="
                        flex-1 px-4 py-2 mb-3
                        border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    />
                    <button className="bg-blue-500  rounded-lg text-white px-3 py-1 mb-3 " onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>

                {targetUser && (
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100">
                        <span>{targetUser}</span>
                        <button
                            disabled={connectChatState === 'pending'}
                            onClick={() => {
                                if (connectChatState == 'incoming') {
                                    changeStatusConnectChat('connected', user.username, targetUser);
                                } else if (connectChatState == 'none') {
                                    sendChatInvitation(user.username, targetUser);
                                } else if (connectChatState == 'connected') {
                                    setSelectedUser(targetUser);
                                    setType('people');
                                    onClose();
                                }
                            }}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            {parseChatConnectState(connectChatState)}
                        </button>
                    </div>
                )}

                {targetUser === null && <p className="text-center text-gray-500">Không tìm thấy người dùng</p>}
            </div>
        </div>
    );
}

export default SearchUserModal;
