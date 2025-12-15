import { UserPlus } from 'lucide-react';
import ConversationItem from './ConversationItem';

function ConversationGroup() {
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500">Nhóm chat</p>
                    <UserPlus className="text-gray-500" />
                </div>

                <div className="flex flex-col gap-3 mt-5">
                    <ConversationItem />
                    <ConversationItem />
                    <ConversationItem />
                </div>
            </div>
        </>
    );
}

export default ConversationGroup;
