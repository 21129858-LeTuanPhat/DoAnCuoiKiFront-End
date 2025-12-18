import { ChatMessage } from '../../../model/ChatMessage';
import { useBoardContext } from '../../../hooks/useBoardContext';

function ContentItem({ message }: { message: ChatMessage }) {
    const { selectedUser } = useBoardContext();
    return selectedUser === message.name ? (
        <li>
            <div className="mt-4">
                <div className="flex items-start gap-2">
                    <img
                        src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                        alt="hình ảnh"
                        className="rounded-full w-8 h-8"
                    />
                    <div className="max-w-xl break-words bg-white text-black p-2 rounded-xl">
                        <p className="break-words">{message.mes}</p>
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{message.createAt}</div>
            </div>
        </li>
    ) : (
        <li>
            <div className="mt-4">
                <div className="flex items-start gap-2 flex-row-reverse">
                    <div className="max-w-xl break-words bg-purple-400 text-white p-2 rounded-xl">
                        <p className="break-words">{message.mes}</p>
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">{message.createAt}</div>
            </div>
        </li>
    );
}

export default ContentItem;
