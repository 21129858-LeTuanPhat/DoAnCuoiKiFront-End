import { ArrowBigDownDash } from 'lucide-react';
import { Forward } from 'lucide-react';
interface DataImage {
    name?: string | null;
    type?: string;
    data: string;
    check: boolean;
    openShareButton: boolean;
    onClick?: () => void;
    darkMode?: boolean;
}
function FileImage({ name, type, data = '', check = false, openShareButton, onClick, darkMode }: DataImage) {
    const filename = data.split('/').pop() ?? '';
    const parts = filename.split('-');
    const afterDash = parts.slice(1).join('-');
    const downloadImage = async (url: string) => {
        const res = await fetch(url);
        const blob = await res.blob();

        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = blobUrl;
        a.download = url.split('/').pop() ?? 'image.png';

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(blobUrl);
    };
    return check === true ? (
        <div className="max-w-xs rounded-xl flex flex-col bg-purple-400 relative">
            <img src={data} alt="ảnh bị lỗi" className="rounded-t-xl" />
            <div className="flex justify-between p-4 text-white">
                <h3>{afterDash}</h3>
                <ArrowBigDownDash onClick={() => downloadImage(data)} className="cursor-pointer" />
            </div>
            {openShareButton && (
                <Forward
                    onClick={onClick}
                    className="absolute top-2 -left-6 bg-[#ccc] rounded-full hover:text-blue-400 cursor-pointer"
                    size={15}
                />
            )}
        </div>
    ) : (
        <div
            className={`max-w-xs rounded-xl flex flex-col ${
                darkMode === false ? 'bg-white' : 'bg-[#24232a]'
            }  relative`}
        >
            {type === 'room' && <p className="text-sm text-gray-600">{name}</p>}
            <img src={data} alt="ảnh bị lỗi" className="rounded-t-xl" />
            <div className={`flex justify-between p-4  ${darkMode === false ? 'text-black' : 'text-white'}`}>
                <h3>{afterDash}</h3>
                <ArrowBigDownDash onClick={() => downloadImage(data)} className="cursor-pointer" />
            </div>
            {openShareButton && (
                <Forward
                    onClick={onClick}
                    className={'absolute top-2 -right-6 bg-[#ccc] rounded-full hover:text-blue-400 cursor-pointer'}
                    size={15}
                />
            )}
        </div>
    );
}

export default FileImage;
