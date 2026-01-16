import { ChatMessage } from '../../../../model/ChatMessage';
import { formatAnyTimeToVN } from '../../../../helps/formatServerTimeVN';
import { MapPin } from 'lucide-react';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

interface LocationItemProps {
    message: ChatMessage;
}

function LocationItem({ message }: LocationItemProps) {
    const { selectedUser, type } = useBoardContext();
    const user = useSelector((state: RootState) => state.user);
    const isOther = type === 'people'
        ? selectedUser === message.name
        : user.username !== message.name;

    const { latitude, longitude } = message.mes.data as any;
    const locationStr = `${latitude},${longitude}`;
    return (
        <li>
            <div className="mt-4">
                <div className={isOther ? 'flex  items-end gap-2' : 'flex gap-2  items-end flex-row-reverse'}>
                    {isOther && (
                        <img
                            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                            alt="hình ảnh"
                            className="rounded-full w-8 h-8"
                        />
                    )}
                    <div
                        className={
                            isOther
                                ? 'max-w-xs sm:max-w-md break-words bg-white text-black p-2 rounded-xl shadow-sm'
                                : 'max-w-xs sm:max-w-md break-words bg-white text-white p-2 rounded-xl shadow-sm'
                        }
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className={isOther ? 'text-red-500' : 'text-red-500'} />
                            <span className="font-semibold text-sm text-red-500">Vị trí đã chia sẻ</span>
                        </div>
                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <iframe
                                title="Location Share"
                                className="w-full h-full"
                                src={`https://maps.google.com/maps?q=${locationStr}&output=embed`}

                            ></iframe>
                        </div>

                    </div>
                </div>
                {/* <div
                    className={isOther ? 'text-xs text-gray-500 mt-1' : 'text-xs text-gray-500 mt-1 text-right'}
                >
                    {formatAnyTimeToVN(message.createAt)}
                </div> */}
            </div>
        </li>
    );
}

export default LocationItem;
