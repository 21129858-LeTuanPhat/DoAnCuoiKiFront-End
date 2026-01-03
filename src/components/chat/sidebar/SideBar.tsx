import ConversationGroup from './ConversationGroup';
import ConversationPeople from './ConversationPeople';
import Moji from './Moji';
import { useEffect, useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { User } from '../../../model/User';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Profile } from './Profile';
import { ProfileProvider } from '../Context/ProfileCotext';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import FormCreateGroup from './FormCreateGroup';
import FormCreateStory from './FormCreateStory';
import ListStory from './ListStory';

function SideBar() {
    const [users, setUsers] = useState<User[]>([]);
    const loginname = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(true);
    const [openStory, setopenStory] = useState(false);
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
        <div className="flex flex-col h-full w-full *:items-start  p-3 shadow-sm ">
            <Moji />
            <ListStory
                onOpenCreateStory={() => {
                    alert('open create story');
                    setopenStory(true);
                }}
            />
            <div className="flex-1 w-full overflow-y-auto px-3 py-1 space-y-3">
                <ConversationPeople
                    users={users.filter((user) => user.type === 0 && user.name !== loginname.username)}
                />
                <ConversationGroup users={users.filter((user) => user.type === 1)} />
            </div>

            <ProfileProvider>
                <Profile />
            </ProfileProvider>

            {openStory && <FormCreateStory />}
        </div>
    );
}
export default SideBar;

// useEffect(() => {
//     const ws = WebSocketManager.getInstance();

//     const off = ws.onMessage((msg) => {
//         console.log('msg:', JSON.stringify(msg, null, 2));
//         if (msg.status == 'success' && msg.event == 'GET_USER_LIST') {
//             console.log('IF');
//             setUsers(msg.data as User[]);
//         }
//     });

//     ws.sendMessage(
//         JSON.stringify({
//             action: 'onchat',
//             data: {
//                 event: 'GET_USER_LIST',
//             },
//         }),
//     );

//     return off;
// }, []);
