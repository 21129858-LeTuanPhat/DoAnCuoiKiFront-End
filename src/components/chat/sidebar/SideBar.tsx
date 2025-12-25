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

function SideBar() {
    const [users, setUsers] = useState<User[]>([]);
    const loginname = useSelector((state: RootState) => state.user);
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        const offGetUserList = ws.onMessage('GET_USER_LIST', (msg) => {
            if (msg.status == 'success' && msg.event == 'GET_USER_LIST') {
                ws.unSubcribe('GET_USER_LIST');
                setUsers(msg.data as User[]);
            }
        });
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'GET_USER_LIST',
                },
            }),
        );
    }, []);

    return (
        <div className="flex flex-col h-full items-start space-y-5 p-3 shadow-sm ">
            <Moji />
            <div className="flex-1 w-full overflow-y-auto p-3 space-y-3">
                <ConversationPeople
                    users={users.filter((user) => user.type === 0 && user.name !== loginname.username)}
                />
                <ConversationGroup users={users.filter((user) => user.type === 1)} />
            </div>

            <ProfileProvider>
                <Profile />
            </ProfileProvider>
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
