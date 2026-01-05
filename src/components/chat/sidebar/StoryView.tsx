import React, { useState, useEffect } from 'react';
import Story from '../../../model/Story';
import { formatDate, parseTimeAgo } from '../../../config/utils';
import { CircleChevronLeftIcon, CircleChevronRight, CircleChevronRightIcon, CircleX, Eye, Heart } from 'lucide-react';
import { parse } from 'path';

function StoryViewer({ stories, onClose, index }: { stories: Story[]; onClose: () => void; index: number }) {
    const [currentIndex, setCurrentIndex] = useState(index);
    const [progress, setProgress] = useState(0);

    const currentStory = stories[currentIndex];

    useEffect(() => {
        const intervalTime = 50;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return ++prev;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }

        setProgress(0);
    };

    return (
        <div className=" fixed inset-0 z-10  bg-black flex items-center justify-center">
            <div className=" w-full h-full flex items-center justify-center">
                <div className="relative w-[30vw] h-full rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
                    <img src={currentStory.imageUrl} alt="story" className="w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

                    <div className="absolute top-5  w-full p-3 z-30 flex flex-col gap-2">
                        <div className="flex gap-1 h-1">
                            {stories.map((_, index) => (
                                <div key={index} className="flex-1 bg-white/30 rounded-full overflow-hidden h-full">
                                    <div
                                        className="bg-white h-full rounded-full "
                                        style={{
                                            width:
                                                index === currentIndex
                                                    ? `${progress}%`
                                                    : index < currentIndex
                                                    ? '100%'
                                                    : '0%',
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2 text-white">
                                <div className="p-[2px] rounded-full bg-gradient-to-r from-yellow-400 to-purple-600">
                                    <img
                                        src={
                                            currentStory.ownerAvatarUrl ??
                                            'https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220'
                                        }
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full border-2 border-black object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold leading-none">
                                        {currentStory.ownerUsername}
                                    </span>

                                    <span className="text-xs opacity-70 leading-none mt-1">
                                        {parseTimeAgo(currentStory.createAt)}
                                    </span>

                                    <div className="flex items-center gap-4 text-xs text-white/80 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Eye size={14} />
                                            <span>{currentStory.view ?? 0}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Heart size={14} className="text-red-500" />
                                            <span>{currentStory.like ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CircleX color="gray" size={25} />
                        </div>
                    </div>

                    <div
                        className="absolute left-0 z-50 top-24 cursor-pointer opacity-50 hover:opacity-100"
                        onClick={handlePrev}
                    >
                        <CircleChevronLeftIcon size={48} color="white" className="m-auto mt-52 " />
                    </div>

                    <div
                        className="absolute right-0 z-50 top-24 cursor-pointer opacity-50 hover:opacity-100"
                        onClick={handleNext}
                    >
                        <CircleChevronRightIcon size={48} color="white" className="m-auto mt-52 " />
                    </div>

                    <div className="absolute bottom-2 w-full p-4 z-30 flex items-center gap-3 pb-6 md:pb-4">
                        <input
                            type="text"
                            placeholder="Gửi tin nhắn..."
                            className="flex-1 bg-transparent border border-white/40 rounded-full px-4 py-2.5 text-white text-sm placeholder-slate-50 focus:outline-none "
                        />

                        <button className="text-2xl hover:scale-110 ">
                            <Heart color="red" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoryViewer;
