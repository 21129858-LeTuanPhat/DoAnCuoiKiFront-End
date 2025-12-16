import ConversationGroup from './ConversationGroup';
import ConversationPeople from './ConversationPeople';
import Moji from './Moji';
import { useEffect, useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { User } from '../../../model/User';

function SideBar() {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const ws = WebSocketManager.getInstance();

        const off = ws.onMessage((msg) => {
            console.log('msg:', JSON.stringify(msg, null, 2));
            if (msg.status == 'success' && msg.event == 'GET_USER_LIST') {
                console.log('IF');
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

        return off;
    }, []);

    return (
        <div className="flex flex-col items-start space-y-5 p-3 shadow-sm">
            <Moji />
            <ConversationPeople users={users.filter((user) => user.type === 0)} />
            <ConversationGroup users={users.filter((user) => user.type === 1)} />
        </div>
    );
}

export default SideBar;
