import { Plus } from 'lucide-react';
import { Root } from 'react-dom/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import useStories from '../../../hooks/useStories';
import Story from '../../../model/Story';
import { useContext } from 'react';
import { ProfileContext } from '../Context/ProfileCotext';
import { avatarDefault } from '../../../config/utils';
function ListStory({
    onOpenCreateStory,
    onOpenStoryView,
}: {
    onOpenCreateStory?: () => void;
    onOpenStoryView: (index: number, stories: Story[]) => void;
}) {
    const { profileInfor } = useContext(ProfileContext)!;

    const user = useSelector((state: RootState) => state.user);
    const stories = useStories({ username: user.username! });

    console.log('stories in list story:', stories);

    return (
        <div className="flex flex-col  px-3 pt-1">
            <p className="text-gray-500 select-none mb-2">Story</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide items-center  w-full max-w-full pb-2 ">
                <StoryUpLoad
                    avatarUrl={profileInfor?.imageUrl ?? avatarDefault}
                    onOpenCreateStory={onOpenCreateStory}
                />
                {stories.map((story: Story, index: number) => (
                    <StoryItem
                        key={story.id}
                        name={story.ownerUsername}
                        imageUrl={story.imageUrl}
                        onClick={() => onOpenStoryView(index, stories)}
                    />
                ))}
            </div>
        </div>
    );
}
export default ListStory;
function StoryItem({ name, imageUrl, onClick }: { name: string; imageUrl?: string; onClick?: () => void }) {
    return (
        <div className="flex flex-col items-center cursor-pointer shrink-0 select-none" onClick={onClick}>
            <div className="w-16 h-16 rounded-full  border-2  p-0.5 border-yellow-400 ">
                <img src={imageUrl ?? avatarDefault} alt={name} className="w-full h-full rounded-full object-cover" />
            </div>
            <p className="text-sm font-semibold mt-1 whitespace-nowrap text-gray-400">{name}</p>
        </div>
    );
}
function StoryUpLoad({
    name = 'Your Story',
    avatarUrl = avatarDefault,
    onOpenCreateStory,
}: {
    name?: string;
    avatarUrl?: string;
    onOpenCreateStory?: () => void;
}) {
    return (
        <div className="flex flex-col items-center cursor-pointer shrink-0 select-none" onClick={onOpenCreateStory}>
            <div className="relative  w-16 h-16 rounded-full  border-2 p-0.5 border-blue-400 ">
                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                <div className="absolute  w-6 h-6 bg-blue-500 rounded-full p-0.5 border border-white flex items-center justify-center bottom-0 right-0">
                    <Plus size={18} color="#ffffff" className="m-auto " />
                </div>
            </div>
            <p className="text-sm font-semibold mt-1 whitespace-nowrap text-gray-400">Thêm tin</p>
        </div>
    );
}
