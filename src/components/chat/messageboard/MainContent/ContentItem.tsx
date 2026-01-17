import { ChatMessage } from '../../../../model/ChatMessage';
import FileItem from './FileItem';
import FileImage from './FileImage';

import { formatAnyTimeToVN } from '../../../../helps/formatServerTimeVN';
import { useState } from 'react';

import { Forward } from 'lucide-react';

import ModalShareMess from './ModalShareMess';
import CardItem from './CardItem';
interface ItemContent {
    message: ChatMessage;
    color: boolean;
    darkMode?: boolean;
}
function ContentItem({ darkMode, message, color }: ItemContent) {
    const [openShareButton, setOpenShareButton] = useState(false);
    const [openModalShare, setOpenModalShare] = useState(false);

    return (
        <>
            {openModalShare === true && (
                <ModalShareMess
                    data={message.mes.data}
                    type={message.mes.type}
                    openModalShare={openModalShare}
                    setOpenModalShare={setOpenModalShare}
                />
            )}
            <li onMouseEnter={() => setOpenShareButton(true)} onMouseLeave={() => setOpenShareButton(false)}>
                <div className="mt-4">
                    <div
                        className={
                            color === true ? 'flex items-start gap-2' : 'flex items-start gap-2 flex-row-reverse'
                        }
                    >
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
                                className={`max-w-xl break-words p-2 rounded-xl relative
                         ${
                             darkMode === false
                                 ? color === true
                                     ? 'bg-white text-black'
                                     : 'bg-purple-400 text-white'
                                 : color === true
                                   ? 'bg-[#24232a] text-white'
                                   : 'bg-purple-400 text-white'
                         }
                            `}
                            >
                                <p className="break-words">{message.mes.data}</p>
                                {openShareButton && (
                                    <Forward
                                        onClick={() => setOpenModalShare(true)}
                                        className={
                                            color === true
                                                ? 'absolute top-2 -right-6 bg-[#ccc] rounded-full hover:text-blue-400 cursor-pointer'
                                                : 'absolute top-2 -left-6 bg-[#ccc] rounded-full hover:text-blue-400 cursor-pointer'
                                        }
                                        size={15}
                                    />
                                )}
                            </div>
                        ) : message.mes.type === 1 ? (
                            <FileImage
                                darkMode={darkMode}
                                onClick={() => setOpenModalShare(true)}
                                openShareButton={openShareButton}
                                data={message.mes.data}
                                check={color === true ? false : true}
                            />
                        ) : message.mes.type === 2 ? (
                            <FileItem
                                darkMode={darkMode}
                                onClick={() => setOpenModalShare(true)}
                                openShareButton={openShareButton}
                                data={message.mes.data}
                                check={color === true ? false : true}
                            />
                        ) : message.mes.type === -1 ? (
                            <div className="w-full ">
                                <div className="m-auto flex items-center justify-center max-w-md break-words bg-gray-200 text-black p-2 rounded-3xl italic">
                                    <p> {message.mes.data} </p>
                                </div>
                            </div>
                        ) : message.mes.type === -50 ? (
                            <CardItem data={message.mes.data} />
                        ) : (
                            ''
                        )}
                    </div>
                    {message.mes.type !== -1 && (
                        <div
                            className={
                                color === true ? 'text-xs text-gray-500 mt-1' : 'text-xs text-gray-500 mt-1 text-right'
                            }
                        >
                            {formatAnyTimeToVN(message.createAt)}
                        </div>
                    )}
                </div>
            </li>
        </>
    );
}

export default ContentItem;
