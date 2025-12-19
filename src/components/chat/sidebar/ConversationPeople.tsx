import { Plus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { useEffect } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { useState } from 'react';
import { User } from '../../../model/User';
import { useBoardContext } from '../../../hooks/useBoardContext';
function ConversationPeople({ users }: { users: User[] }) {
    const { selectedUser, setSelectedUser } = useBoardContext();
    const handleSelectedUser = (name: string) => {
        setSelectedUser((prev) => (prev === name ? '' : name));
    };
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500">Bạn bè</p>
                    <Plus className="text-gray-500" />
                </div>
                <div className="flex flex-col gap-3 mt-5">
                    {users.map((user) => (
                        <ConversationItem
                            user={user}
                            isActive={selectedUser === user.name}
                            onClick={() => handleSelectedUser(user.name)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default ConversationPeople;
