import { Plus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { User } from '../../../model/User';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useEffect, useState } from 'react';
import SearchUserModal from './SearchBar';
import { getAllProfile } from '../../../services/firebaseService';
import ProfileForm from '../../../model/ProfileForm';

function ConversationPeople({ users }: { users: User[] }) {
    const { selectedUser, setSelectedUser, setType } = useBoardContext();
    const [open, setOpen] = useState(false);
    const [listUser, setListUser] = useState<ProfileForm[]>([]);

    const handleSelectedUser = (name: string) => {
        setSelectedUser((prev) => (prev === name ? '' : name));
        setType('people');
    };

    useEffect(() => {
        if (users.length === 0) return;

        const fetchProfiles = async () => {
            console.log('Fetching profiles...');
            const profiles = await getAllProfile();
            console.log('profiles:', profiles);
            const updateProfiles = users.map((user) => {
                if (profiles?.some((profile) => profile.username === user.name)) {
                    return profiles?.find((profile) => profile.username === user.name)!;
                } else {
                    return {
                        username: user.name,
                        fullName: '',
                        address: '',
                        introduce: '',
                    };
                }
            });
            setListUser(updateProfiles || []);
        };
        fetchProfiles();
    }, [users]);
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
                    {listUser.map((user) => (
                        <ConversationItem
                            key={user.username}
                            user={user}
                            isActive={selectedUser === user.username}
                            onClick={() => handleSelectedUser(user.username)}
                        />
                    ))}
                </div>
            </div>
            {open && <SearchUserModal onClose={() => setOpen(false)} />}
        </>
    );
}

export default ConversationPeople;
