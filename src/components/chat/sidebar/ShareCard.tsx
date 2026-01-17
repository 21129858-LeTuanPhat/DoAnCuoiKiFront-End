import { CircleX, Heart } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { getFriendName } from '../../../services/firebaseService';
import { avatarDefault, formatDate } from '../../../config/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import WebSocketManager from '../../../socket/WebSocketManager';
import { User } from '../../../model/User';
import { ListConversationContext } from '../Context/ListConversation';

function ShareCardModal({ onClose, sharedName }: { onClose: () => void; sharedName: string }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [friendList, setFriendList] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const { setUsers } = useContext(ListConversationContext)!;

    const toggleUser = (username: string) => {
        setSelected((prev) => {
            if (prev.includes(username)) {
                return prev.filter((u) => u !== username);
            } else {
                return [...prev, username];
            }
        });
    };
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleShareCard = async (friends: string[]) => {
        const webSocket = WebSocketManager.getInstance();

        for (const friend of friends) {
            console.log('Sharing card to', friend);
            console.log('Shared name:', sharedName);
            webSocket.sendMessage(
                JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'SEND_CHAT',
                        data: {
                            type: 'people',
                            to: friend,
                            mes: encodeURIComponent(
                                JSON.stringify({
                                    type: -50,
                                    data: {
                                        sharedName: sharedName,
                                        to: friend,
                                    },
                                }),
                            ),
                        },
                    },
                }),
            );
            await sleep(300);

            setUsers((prev) => {
                const data: User[] = [];
                for (const f of friends) {
                    const isExist = prev.find((u) => u.name === f);
                    if (!isExist) {
                        data.push({ id: f, name: f, type: 0 });
                    }
                }

                return [...prev, ...data];
            });
        }
    };
    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            const friends = await getFriendName(user?.username!);
            setFriendList(friends || []);
            setLoading(false);
        };
        fetchFriends();
    }, []);

    if (loading) {
        return <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center "></div>;
    }

    return (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="h-96 max-h-96  w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <p className="font-semibold text-lg">Chia sẻ danh thiếp</p>
                    <CircleX className="cursor-pointer" onClick={onClose} />
                </div>

                <div className="p-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm bạn bè"
                        className="w-full px-3 py-2 border rounded-lg outline-none"
                    />
                </div>

                <div className="flex-1 overflow-y-auto px-3">
                    {friendList
                        .filter((f) => f.toLowerCase().includes(search.toLowerCase()) && f !== sharedName)
                        .map((friend) => (
                            <div
                                key={friend}
                                className="flex items-center justify-between py-2 cursor-pointer"
                                onClick={() => toggleUser(friend)}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={avatarDefault} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-medium">{friend}</p>
                                    </div>
                                </div>

                                <input type="checkbox" checked={selected.includes(friend)} className="w-4 h-4" />
                            </div>
                        ))}
                </div>

                <div className="flex gap-3 p-4 border-t">
                    <button className="flex-1 py-2 rounded-lg border" onClick={onClose}>
                        Hủy
                    </button>

                    <button
                        className="flex-1 py-2 rounded-lg bg-green-500 text-white font-semibold disabled:opacity-40"
                        disabled={selected.length === 0}
                        onClick={async () => {
                            await handleShareCard(selected);
                            onClose();
                        }}
                    >
                        Chia sẻ ({selected.length})
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ShareCardModal;
