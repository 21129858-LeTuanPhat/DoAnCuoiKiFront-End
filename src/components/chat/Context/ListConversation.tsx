import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';
import { ChatMessage } from '../../../model/ChatMessage';
import { useEffect } from 'react';
import { getUserProfile } from '../../../services/firebaseService';
import ProfileForm from '../../../model/ProfileForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ListConversationContextType } from '../../../model/ProfileContextType';
import { ProfileProvider } from './ProfileCotext';
import WebSocketManager from '../../../socket/WebSocketManager';
import { User } from '../../../model/User';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import { useBoardContext } from '../../../hooks/useBoardContext';

const ListConversationContext = createContext<ListConversationContextType | null>(null);

function ListConversationProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { setSelectedUser, setType, setOwner } = useBoardContext();
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        let isMounted = true;

        ws.onMessage('GET_USER_LIST', (msg) => {
            if (msg.status === 'success' && msg.event === 'GET_USER_LIST') {
                console.log(' Received user list:', msg.data);

                if (isMounted) {
                    const userData = msg.data as User[];
                    setUsers(userData);
                    setLoading(false);
                }
            }
        });

        ws.onMessage(Date.now().toString(), (msg) => {
            console.log('CREATE_ROOM in list con message received:', msg);
            if (msg.status === 'success' && msg.event === 'CREATE_ROOM') {
                console.log(' Received user list:', msg.data);
                // "data": {
                //     "id": 1230,
                //     "name": "dv007",
                //     "own": "phuc1",
                //     "createTime": "2026-01-09 07:44:37.0",
                //     "userList": [],
                //     "chatData": []
                // },
                const userData = msg.data;
                const newUser: User = {
                    id: userData.name,
                    name: userData.name,
                    type: 1,
                };

                setUsers((prevUsers) => [...prevUsers, newUser]);
                setSelectedUser(newUser.name);
                setType('room');
                setOwner(userData.own);
                setLoading(false);
            }
        });

        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: { event: 'GET_USER_LIST' },
            }),
        );

        return () => {
            isMounted = false;
            ws.unSubcribe('GET_USER_LIST');
        };
    }, []);
    if (loading) return <LoadingProfileSkeleton />;

    return (
        <ListConversationContext.Provider
            value={{
                users,
                setUsers,
                loading,
                setLoading,
            }}
        >
            {children}
        </ListConversationContext.Provider>
    );
}

export { ListConversationContext, ListConversationProvider };
