import { avatarDefault } from '../../../config/utils';
import ProfileForm from '../../../model/ProfileForm';

function ConversationItem({
    darkMode,
    user,
    isActive,
    onClick,
}: {
    darkMode: boolean;
    user: ProfileForm;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`
    w-full px-4 py-2 rounded-xl shadow-lg transition-shadow
    hover:shadow-md hover:cursor-pointer flex select-none
    ${darkMode ? 'bg-[#24232a]' : 'bg-[#faf7fe]'}
    ${isActive ? 'border border-blue-400' : 'border border-gray-700'}
  `}
        >
            <img src={`${user.imageUrl ?? avatarDefault}`} alt="" className="w-14 h-14 rounded-full object-cover" />
            <div className="ml-4 flex flex-col justify-center">
                <p className={`font-semibold ${darkMode === false ? 'text-gray-900' : 'text-slate-300'}`}>
                    {user.username}
                </p>
                <p className="text-sm text-gray-500">Hello, how are you?</p>
            </div>
        </div>
    );
}

export default ConversationItem;
