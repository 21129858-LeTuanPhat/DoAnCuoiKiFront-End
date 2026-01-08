import { avatarDefault } from '../../../config/utils';
import ProfileForm from '../../../model/ProfileForm';

function ConversationItem({ user, isActive, onClick }: { user: ProfileForm; isActive: boolean; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={
                isActive
                    ? 'w-full px-4 py-2 rounded-xl bg-[#faf7fe] shadow-lg transition-shadow border border-purple-500 hover:shadow-md hover:cursor-pointer flex select-none'
                    : 'w-full px-4 py-2 rounded-xl bg-[#faf7fe] shadow-lg transition-shadow hover:shadow-md hover:cursor-pointer flex select-none'
            }
        >
            <img src={`${user.imageUrl ?? avatarDefault}`} alt="" className="w-14 h-14 rounded-full object-cover" />
            <div className="ml-4 flex flex-col justify-center">
                <p className="font-semibold text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">Hello, how are you?</p>
            </div>
        </div>
    );
}

export default ConversationItem;
