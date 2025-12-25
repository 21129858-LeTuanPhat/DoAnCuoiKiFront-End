import { Plus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { User } from '../../../model/User';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useState } from 'react';
import SearchUserModal from './SearchBar';
function ConversationPeople({ users }: { users: User[] }) {
    const { selectedUser, setSelectedUser, setType } = useBoardContext();
    const [open, setOpen] = useState(false);

    const handleSelectedUser = (name: string) => {
        setSelectedUser((prev) => (prev === name ? '' : name));
        setType('people');
    };
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500 select-none cursor-pointer">Bạn bè</p>
                    <Plus
                        className="cursor-default hover:cursor-pointer text-gray-500"
                        onClick={() => setOpen(!open)}
                    />
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
            {open && <SearchUserModal onClose={() => setOpen(false)} />}
        </>
    );
}

export default ConversationPeople;
