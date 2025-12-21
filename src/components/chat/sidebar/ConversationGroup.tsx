import { UserPlus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { User } from '../../../model/User';
import { useBoardContext } from '../../../hooks/useBoardContext';
function ConversationGroup({ users }: { users: User[] }) {
    const { selectedUser, setSelectedUser, type, setType } = useBoardContext();
    const handleSelectedUser = (name: string) => {
        setSelectedUser((prev) => (prev === name ? '' : name));
        setType('room');
    };
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500 select-none">Nhóm chat</p>
                    <UserPlus className="text-gray-500" />
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

export default ConversationGroup;
