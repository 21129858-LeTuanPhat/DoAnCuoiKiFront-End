import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import ContentItem from './ContentItem';
import { useBoardContext } from '../../../hooks/useBoardContext';
import { ChatMessage } from '../../../model/ChatMessage';
import ContentItemCall from './ItemCall';
import RingingModal from '../../modal/RingingModal';
function MainContent({ username }: any) {
    const [page, setPage] = useState<number>(1);
    const divRef = useRef<HTMLDivElement>(null);
    const { listMessage, setListMessage, type } = useBoardContext();
    const oldScrollHeightRef = useRef(0);
    useEffect(() => {
        console.log('useeff1');
        setListMessage([]);
        setPage(1);
    }, [username]);
    useEffect(() => {
        console.log('useeff2');

        console.log('e2');
        const ws = WebSocketManager.getInstance();
        if (type === 'people') {
            ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
                if (msg.status === 'success') {
                    if (msg.event === 'GET_PEOPLE_CHAT_MES') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        setListMessage((prev) => {
                            const newList = [...msg.data].reverse().concat(prev);
                            return newList;
                        });
                    } else if (msg.event === 'SEND_CHAT') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        const newMessage: ChatMessage = {
                            id: msg.data.id,
                            name: msg.data.name,
                            type: msg.data.tpye,
                            to: msg.data.to,
                            mes: decodeURIComponent(msg.data.mes),
                            createAt: new Date().toISOString(),
                        };
                        setListMessage((prev) => [...prev, newMessage]);
                    }
                }
            });
            ws.sendMessage(
                JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'GET_PEOPLE_CHAT_MES',
                        data: {
                            name: username,
                            page: page,
                        },
                    },
                }),
            );
        } else if (type === 'room') {
            ws.onMessage('GET_ROOM_CHAT_MES', (msg) => {
                if (msg.status === 'success') {
                    if (msg.event === 'GET_ROOM_CHAT_MES') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        setListMessage((prev) => {
                            const newList = [...msg.data.chatData].reverse().concat(prev);
                            return newList;
                        });
                    } else if (msg.event === 'SEND_CHAT') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        const newMessage: ChatMessage = {
                            id: msg.data.id,
                            name: msg.data.name,
                            type: msg.data.tpye,
                            to: msg.data.to,
                            mes: decodeURIComponent(msg.data.mes),
                            createAt: new Date().toISOString(),
                        };
                        setListMessage((prev) => [...prev, newMessage]);
                    }
                }
            });
            ws.sendMessage(
                JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'GET_ROOM_CHAT_MES',
                        data: {
                            name: username,
                            page: page,
                        },
                    },
                }),
            );
        }

        return () => {
            if (type === 'people') {
                ws.unSubcribe('GET_PEOPLE_CHAT_MES');
            } else if (type === 'room') {
                ws.unSubcribe('GET_ROOM_CHAT_MES');
            }
        };
    }, [page]);
    useEffect(() => {
        console.log('e3');
        const div = divRef.current;

        if (!div) return;

        if (page === 1) {
            div.scrollTop = div.scrollHeight;
        }
        const handleScroll = () => {
            if (div.scrollTop === 0 && listMessage.length >= 50) {
                setPage((prev) => {
                    const newpage = prev + 1;
                    return newpage;
                });
            }
        };
        div.addEventListener('scroll', handleScroll);
        return () => {
            console.log('e3-3');
            div.removeEventListener('scroll', handleScroll);
        };
    }, [listMessage]);
    useLayoutEffect(() => {
        if (page > 1) {
            const div = divRef.current;
            if (!div) return;

            div.scrollTop = div.scrollHeight - oldScrollHeightRef.current;
        }
    }, [listMessage]);
    console.log('list mess', listMessage)



    return (
        <section className="bg-[#f0f4fa] h-[calc(737.6px-72px-65px)]">
            {listMessage.length > 0 ? (
                <div
                    ref={divRef}
                    className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200"
                >
                    <ul className="p-2">
                        {listMessage.map((message, index) => {
                            try {
                                const obj = JSON.parse(message.mes)
                                if (typeof obj === 'object' && obj !== null) {
                                    return <ContentItemCall message={message} key={index}></ContentItemCall>
                                }
                            } catch {
                                return <ContentItem message={message} key={index} />;
                            }

                        })}
                        <ContentItem message={{
                            id: 1231321,
                            name: 'tai',
                            type: 12,
                            to: 'phucabc',
                            mes: "string",
                            createAt: "20 / 1012"
                        }} key={1122} />
                    </ul>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
            <RingingModal open={true}></RingingModal>
        </section>
    );
}

export default MainContent;
