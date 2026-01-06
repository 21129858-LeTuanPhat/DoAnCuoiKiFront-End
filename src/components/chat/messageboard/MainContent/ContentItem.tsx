import { ChatMessage } from '../../../../model/ChatMessage';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import FileItem from './FileItem';
import FileImage from './FileImage';
import { Camera, CameraOff, Phone, PhoneOff } from 'lucide-react';
function ContentItem({ message }: { message: ChatMessage }) {
    const { selectedUser, type } = useBoardContext();
    const user = useSelector((state: RootState) => state.user);
    if (message.mes.type >= 1) {
        console.log('bị lỗi nè', message.mes.data)
    }
    return type === 'people' ? (
        selectedUser === message.name ? (
            <li>
                <div className="mt-4">
                    <div className="flex items-start gap-2">
                        <img
                            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                            alt="hình ảnh"
                            className="rounded-full w-8 h-8"
                        />
                        {message.mes.type === 0 ?
                            (
                                <div className="max-w-xl break-words bg-white text-black p-2 rounded-xl">
                                    <p className="break-words">{message.mes.data}</p>
                                </div>
                            ) :
                            message.mes.type === 1 ? (
                                <FileImage data={message.mes.data} check={false} />
                            ) : (
                                // <FileItem data={message.mes.data} check={true} />
                                <p>hello file nè</p>
                            )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
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
        ) : (
            <li>
                <div className="mt-4">
                    <div className="flex items-start gap-2 flex-row-reverse">
                        {message.mes.type === 0 ? (
                            <div className="max-w-xl break-words bg-purple-400 text-white p-2 rounded-xl">
                                <p className="break-words">{message.mes.data}</p>
                            </div>
                        ) : message.mes.type === 1 ? (
                            <FileImage data={message.mes.data} check={true} />
                        ) : (
                            // <FileItem data={message.mes.data} check={true} />
                            <p>file nè</p>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
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
        )
    ) : user.username !== message.name ? (
        <li>
            <div className="mt-4">
                <div className="flex items-start gap-2">
                    <img
                        src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                        alt="hình ảnh"
                        className="rounded-full w-8 h-8"
                    />
                    {message.mes.type === 0 ? (
                        <div className="max-w-xl break-words bg-white text-black p-2 rounded-xl">
                            <p className="break-words">{message.mes.data}</p>
                        </div>
                    ) : message.mes.type === 1 ? (
                        <FileImage data={message.mes.data} check={false} />
                    ) : (
                        // <FileItem data={message.mes.data} check={false} />
                        <p>file nè</p>
                    )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
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
    ) : (
        <li>
            <div className="mt-4">
                <div className="flex items-start gap-2 flex-row-reverse">
                    {message.mes.type === 0 ? (
                        <div className="max-w-xl break-words bg-purple-400 text-white p-2 rounded-xl">
                            <p className="break-words">{message.mes.data}</p>
                        </div>
                    ) : message.mes.type === 1 ? (
                        <FileImage data={message.mes.data} check={true} />
                    ) : (
                        // <FileItem data={message.mes.data} check={true} />
                        <p>file nè</p>
                    )}
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
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
