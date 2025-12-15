import ConversationGroup from './ConversationGroup';
import ConversationPeople from './ConversationPeople';
import Moji from './Moji';

function SideBar() {
    return (
        <div className="flex flex-col items-start space-y-5 p-3 shadow-sm">
            <Moji />
            <ConversationPeople />
            <ConversationGroup />
        </div>
    );
}

export default SideBar;
