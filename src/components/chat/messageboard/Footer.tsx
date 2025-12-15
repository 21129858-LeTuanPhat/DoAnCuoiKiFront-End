import { ImagePlus, Smile, Send } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-white h-[65px] rounded-bl-lg ">
            <div className="flex items-center h-full ">
                <div>
                    <ImagePlus className="cursor-pointer mt-2 mb-2 ml-4 mr-8 h-[21.5px]" />
                </div>
                <div className="rounded-2xl border flex-[5] flex items-center my-1">
                    <input
                        type="text"
                        placeholder="Soạn tin nhắn ..."
                        className="flex-[8] p-2 border-none outline-none 
                        bg-transparent"
                    />
                    <button className="p-2">
                        <Smile className="cursor-pointer" />
                    </button>
                </div>
                <button className="m-2 text-white bg-gradient-to-br from-purple-200 via-pink-400 to-pink-400 p-2 rounded-xl">
                    <Send className="cursor-pointer" />
                </button>
            </div>
        </footer>
    );
}

export default Footer;
