import { Download } from 'lucide-react';
import { JSX } from 'react';
import wordIcon from '../../../../assets/img/icon_file/word.png';
import txtIcon from '../../../../assets/img/icon_file/txt.png';
import excelIcon from '../../../../assets/img/icon_file/excel.png';
import pdfIcon from '../../../../assets/img/icon_file/pdf.png';

import { Forward } from 'lucide-react';
interface DataFile {
    data: string;
    check: boolean;
    openShareButton: boolean;
    onClick?: () => void;
}
function FileItem({ data = '', check = false, openShareButton, onClick }: DataFile) {
    const filename = data.split('/').pop() ?? '';
    const parts = filename.split('-');
    const afterDash = parts.slice(1).join('-');
    let FileItem: JSX.Element | null = null;
    if (data.endsWith('.doc') || data.endsWith('.docx')) {
        FileItem = <img src={wordIcon} alt="Word file" className="w-12 h-12" />;
    } else if (data.endsWith('.xls') || data.endsWith('.xlsx')) {
        FileItem = <img src={excelIcon} alt="Word file" className="w-12 h-12 " />;
    } else if (data.endsWith('.pdf')) {
        FileItem = <img src={pdfIcon} alt="Word file" className="w-12 h-12" />;
    }
    return check === true ? (
        <div className="p-1 max-w-xs rounded-xl bg-purple-400 relative">
            <a className=" p-2 no-underline flex gap-2 justify-between" href={data} download>
                <div className="flex justify-center items-center">{FileItem}</div>
                <div className="flex justify-center items-center text-white">
                    <h3 className=" justify-center">{afterDash}</h3>
                </div>
            </a>
            {openShareButton && (
                <Forward
                    onClick={onClick}
                    className="absolute top-2 -left-6 bg-[#ccc] rounded-full hover:text-blue-400 cursor-pointer"
                    size={15}
                />
            )}
        </div>
    ) : (
        <div className="p-1 max-w-xs rounded-xl bg-white relative">
            <a className=" p-2 no-underline flex gap-2 justify-between" href={data} download>
                <div className="flex justify-center items-center">{FileItem}</div>
                <div className="flex justify-center items-center text-black">
                    <h3 className=" justify-center">{afterDash}</h3>
                </div>
            </a>
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

export default FileItem;
