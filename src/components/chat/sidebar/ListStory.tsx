import { Plus } from 'lucide-react';
function ListStory() {
    return (
        <div className="flex flex-col  px-3 pt-1">
            <p className="text-gray-500 select-none mb-2">Story</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide items-center  w-full max-w-full pb-2 ">
                <StoryUpLoad avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220" />
                <StoryItem
                    name="Van A"
                    avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                />
                <StoryItem
                    name="Van B"
                    avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                />
                <StoryItem
                    name="Van C"
                    avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                />
                <StoryItem
                    name="Van D"
                    avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                />
                <StoryItem
                    name="Van E"
                    avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                />
                <StoryItem
                    name="Van E"
                    avatarUrl="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                />
            </div>
        </div>
    );
}
export default ListStory;
function StoryItem({ name, avatarUrl }: { name: string; avatarUrl: string }) {
    return (
        <div className="flex flex-col items-center cursor-pointer shrink-0">
            <div className="w-12 h-12 rounded-full border border-blue-400">
                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            </div>
            <p className="text-sm font-semibold mt-1 whitespace-nowrap">{name}</p>
        </div>
    );
}
function StoryUpLoad({
    name = 'Your Story',
    avatarUrl = 'https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220',
}: {
    name?: string;
    avatarUrl?: string;
}) {
    return (
        <div className="  flex flex-col items-center cursor-pointer shrink-0">
            <div className="relative  w-16 h-16 rounded-full border p-0.5 border-blue-400 ">
                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                <div className="absolute  w-6 h-6 bg-blue-500 rounded-full p-0.5 border border-white flex items-center justify-center bottom-0 right-0">
                    <Plus size={18} color="#ffffff" className="m-auto " />
                </div>
            </div>
            <p className="text-sm font-semibold mt-1 whitespace-nowrap">{name}</p>
        </div>
    );
}
