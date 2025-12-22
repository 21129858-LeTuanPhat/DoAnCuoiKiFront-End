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

function SearchBar() {
    const [open, setOpen] = useState(false);

    return <>{open && <SearchUserModal onClose={() => setOpen(false)} />}</>;
}

function SearchUserModal({ onClose }: { onClose: () => void }) {
    const [keyword, setKeyword] = useState('');
    const webSocket = WebSocketManager.getInstance();
    const [targetUser, setTargetUser] = useState<string | undefined>(undefined);
    const user = useSelector((state: RootState) => state.user);
    const connectChatState = useChatConnect(user.username, targetUser);
    const { setSelectedUser, setType } = useBoardContext();

    const handleSearch = (e: any) => {
        setKeyword(e.target.value);
        webSocket.onMessage('CHECK_USER', (msg: WSMessage) => {
            if (msg.status === 'success') {
                setTargetUser(keyword);
                webSocket.unSubcribe('CHECK_USER');
            }
        });

        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'CHECK_USER',
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
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
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
            </div>
        </div>
    );
}

export default SearchBar;
