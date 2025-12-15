import { Plus } from 'lucide-react';
import ConversationItem from './ConversationItem';

function ConversationPeople() {
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-500">Bạn bè</p>
                    <Plus className="text-gray-500" />
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

export default ConversationPeople;
