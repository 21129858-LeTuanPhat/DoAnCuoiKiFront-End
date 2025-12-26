import { ArrowBigDownDash } from 'lucide-react';

interface DataImage {
    data: string;
    check: boolean;
}
function FileImage({ data, check = false }: DataImage) {
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
        <div className="max-w-xs rounded-xl flex flex-col bg-purple-400">
            <img src={data} alt="ảnh bị lỗi" className="rounded-t-xl" />
            <div className="flex justify-between p-4 text-white">
                <h3>{afterDash}</h3>
                <ArrowBigDownDash onClick={() => downloadImage(data)} className="cursor-pointer" />
            </div>
        </div>
    ) : (
        <div className="max-w-xs rounded-xl flex flex-col bg-white">
            <img src={data} alt="ảnh bị lỗi" className="rounded-t-xl" />
            <div className="flex justify-between p-4 text-black">
                <h3>{afterDash}</h3>
                <ArrowBigDownDash onClick={() => downloadImage(data)} className="cursor-pointer" />
            </div>
        </div>
    );
}

export default FileImage;
