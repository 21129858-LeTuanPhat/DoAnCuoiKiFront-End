import { UserPlus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { User } from '../../../model/User';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { useState, useEffect } from 'react';
import FormCreateGroup from './FormCreateGroup';
import InforGroup from '../../../model/InforGroup';
import { getAllInforGroup } from '../../../services/firebaseService';
import GroupConversationItem from './GroupConversationItem';
function ConversationGroup({ users }: { users: User[] }) {
    const { selectedUser, setSelectedUser, type, setType } = useBoardContext();
    const [open, setOpen] = useState(false);
    const [listGroup, setListGroup] = useState<InforGroup[]>([]);

    const handleSelectedUser = (name: string) => {
        setSelectedUser((prev) => (prev === name ? '' : name));
        setType('room');
    };

    useEffect(() => {
        if (users.length === 0) return;

        const fetchProfiles = async () => {
            console.log('Fetching group profiles...');
            const groups = await getAllInforGroup();
            console.log('All group profiles:', groups);

            const updateGroups: InforGroup[] = users.map((group) => {
                const groupProfile = groups?.find((g) => g.name === group.name);
                return groupProfile
                    ? groupProfile
                    : {
                          name: group.name,
                          description: '',
                          adminUsername: group.name,
                          createAt: Date.now(),
                          menbersCount: 1,
                      };
            });
            setListGroup(updateGroups ?? []);
        };
        fetchProfiles();
    }, [users]);
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500 select-none">Nhóm chat</p>
                    <UserPlus className="text-gray-500 cursor-pointer" onClick={() => setOpen(!open)} />
                </div>
                <div className="flex flex-col gap-3 mt-5">
                    {listGroup.map((group) => (
                        <GroupConversationItem
                            key={group.name}
                            group={group}
                            isActive={selectedUser === group.name}
                            onClick={() => handleSelectedUser(group.name)}
                        />
                    ))}
                </div>

                {open && <FormCreateGroup onClose={() => setOpen(false)} />}
            </div>
        </>
    );
}

export default ConversationGroup;
