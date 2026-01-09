import { Download } from 'lucide-react';
import { JSX } from 'react';
import wordIcon from '../../../../assets/img/icon_file/word.png';
import txtIcon from '../../../../assets/img/icon_file/txt.png';
import excelIcon from '../../../../assets/img/icon_file/excel.png';
import pdfIcon from '../../../../assets/img/icon_file/pdf.png';
interface DataFile {
    data: string;
    check: boolean;
}
function FileItem({ data = '', check = false }: DataFile) {
    const filename = data.split('/').pop() ?? '';
    const parts = filename.split('-');
    const afterDash = parts.slice(1).join('-');
    let FileItem: JSX.Element | null = null;
    if (data.endsWith('.doc') || data.endsWith('.docx')) {
        FileItem = <img src={wordIcon} alt="Word file" className="w-12 h-12" />;
    } else if (data.endsWith('.txt')) {
        FileItem = <img src={txtIcon} alt="Word file" className="w-12 h-12" />;
    } else if (data.endsWith('.xls') || data.endsWith('.xlsx')) {
        FileItem = <img src={excelIcon} alt="Word file" className="w-12 h-12 " />;
    } else if (data.endsWith('.pdf')) {
        FileItem = <img src={pdfIcon} alt="Word file" className="w-12 h-12" />;
    }
    return check === true ? (
        <div className="p-1 max-w-xs rounded-xl bg-purple-400">
            <a className=" p-2 no-underline flex gap-2 justify-between" href={data} download>
                <div className="flex justify-center items-center">{FileItem}</div>
                <div className="flex justify-center items-center text-white">
                    <h3 className=" justify-center">{afterDash}</h3>
                </div>
            </a>
        </div>
    ) : (
        <div className="p-1 max-w-xs rounded-xl bg-white">
            <a className=" p-2 no-underline flex gap-2 justify-between" href={data} download>
                <div className="flex justify-center items-center">{FileItem}</div>
                <div className="flex justify-center items-center text-black">
                    <h3 className=" justify-center">{afterDash}</h3>
                </div>
            </a>
        </div>
    );
}

export default FileItem;
