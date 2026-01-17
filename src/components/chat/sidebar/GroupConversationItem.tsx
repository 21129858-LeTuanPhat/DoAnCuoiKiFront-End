import { avatarDefault } from '../../../config/utils';
import InforGroup from '../../../model/InforGroup';

function ConversationItem({
    darkMode,
    group,
    isActive,
    onClick,
}: {
    darkMode: boolean;
    group: InforGroup;
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
            <img src={`${group.imageUrl ?? avatarDefault}`} alt="" className="w-14 h-14 rounded-full object-cover" />
            <div className="ml-4 flex flex-col justify-center">
                <p className={`${darkMode === false ? 'text-gray-900' : 'text-white'} font-semibold`}>{group.name}</p>
                <p className="text-sm text-gray-500">{group.menbersCount} Thành viên</p>
            </div>
        </div>
    );
}

export default ConversationItem;
