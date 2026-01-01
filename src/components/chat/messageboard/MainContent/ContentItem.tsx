import { ChatMessage } from '../../../../model/ChatMessage';
import FileItem from './FileItem';
import FileImage from './FileImage';
interface ItemContent {
    message: ChatMessage;
    color: boolean;
}
function ContentItem({ message, color }: ItemContent) {
    return (
        <li>
            <div className="mt-4">
                <div className={color === true ? 'flex items-start gap-2' : 'flex items-start gap-2 flex-row-reverse'}>
                    {color === true ? (
                        <img
                            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                            alt="hình ảnh"
                            className="rounded-full w-8 h-8"
                        />
                    ) : (
                        ''
                    )}
                    {message.mes.type === 0 ? (
                        <div
                            className={
                                color === true
                                    ? 'max-w-xl break-words bg-white text-black p-2 rounded-xl'
                                    : 'max-w-xl break-words bg-purple-400 text-white p-2 rounded-xl'
                            }
                        >
                            <p className="break-words">{message.mes.data}</p>
                        </div>
                    ) : message.mes.type === 1 ? (
                        <FileImage data={message.mes.data} check={color === true ? false : true} />
                    ) : (
                        <FileItem data={message.mes.data} check={color === true ? false : true} />
                    )}
                </div>
                <div
                    className={color === true ? 'text-xs text-gray-500 mt-1' : 'text-xs text-gray-500 mt-1 text-right'}
                >
                    {new Date(message.createAt).toLocaleString('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </div>
            </div>
        </li>
    );
}

export default ContentItem;
