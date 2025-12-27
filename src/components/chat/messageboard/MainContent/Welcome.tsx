import { MessageCircleMore } from 'lucide-react';
function Welcome() {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div>
                <div className="relative w-full max-w-[250px] aspect-square flex items-center justify-center m-auto">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 500 500"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <circle
                            cx="250"
                            cy="250"
                            r="160"
                            className="fill-purple-200 origin-center animate-scale-pulse"
                        ></circle>
                    </svg>
                    <div
                        className="absolute 
                                    w-[100px] h-[100px]
                                    rounded-full object-cover
                                    top-1/2 left-1/2 
                                    -translate-x-1/2 -translate-y-1/2
                                    bg-gradient-to-br from-purple-500 to-pink-500 
                                    flex justify-center items-center
                                    "
                    >
                        <MessageCircleMore className="text-white w-[30px] h-[30px]" />
                    </div>
                </div>
                <h2
                    className=" p-2 text-center text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 
                        bg-clip-text text-transparent"
                >
                    Chào mừng bạn đến với Moji!
                </h2>
                <h4 className="my-3 text-center text-slate-500">Chọn một cuộc hội thoại để bắt đầu!</h4>
            </div>
        </div>
    );
}

export default Welcome;
