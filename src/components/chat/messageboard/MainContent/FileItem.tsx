import {} from 'lucide-react';

function FileItem({ data }: any) {
    return (
        <div>
            <a className="max-w-xs rounded-xl" href={data} download>
                Download
            </a>
        </div>
    );
}

export default FileItem;
