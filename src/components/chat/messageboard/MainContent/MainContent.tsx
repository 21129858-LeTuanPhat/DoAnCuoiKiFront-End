import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import WebSocketManager from '../../../../socket/WebSocketManager';
import ContentItem from '../MainContent/ContentItem';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { ChatMessage, TypeMess } from '../../../../model/ChatMessage';
import ContentItemCall from '../ItemCall';
import RingingModal from '../../../modal/RingingModal';
import { CallInterface, CallStatus } from '../../../../model/CallProps';
import { log } from 'console';

function MainContent({ username }: any) {
    const [page, setPage] = useState<number>(1);
    const divRef = useRef<HTMLDivElement>(null);
    const { listMessage, setListMessage, type, right, setRight } = useBoardContext();
    const [initialLoading, setInitialLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const oldScrollHeightRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const oneTimeRef = useRef<boolean>(true);
    const noTransfromRef = useRef<boolean>(false);
    useEffect(() => {
        setListMessage([]);
        setPage(1);
    }, [username]);
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        if (page === 1) {
            setInitialLoading(true);
        } else {
            setFetchingMore(true);
        }
        if (type === 'people') {
            ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
                if (msg.status === 'success') {
                    if (msg.event === 'GET_PEOPLE_CHAT_MES') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        const parsedList: ChatMessage[] = msg.data.map((item: any) => {
                            try {
                                const mesObj = JSON.parse(decodeURIComponent(item.mes));
                                return {
                                    id: item.id,
                                    name: item.name,
                                    type: item.type,
                                    to: item.to,
                                    mes: {
                                        type: mesObj.type,
                                        data: mesObj.data,
                                    },
                                    createAt: item.createAt,
                                };
                            } catch {
                                console.log('lỗi catch', item);
                            }
                        });
                        if (parsedList.length < 50) {
                            setHasMore(false);
                        }
                        setListMessage((prev) => {
                            const newList = parsedList.reverse().concat(prev);
                            return newList;
                        });
                        setInitialLoading(false);
                        setFetchingMore(false);
                    } else if (msg.event === 'SEND_CHAT') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        console.log(oldScrollHeightRef);
                        const mesObj = JSON.parse(decodeURIComponent(msg.data.mes));
                        const newMessage: ChatMessage = {
                            id: msg.data.id,
                            name: msg.data.name,
                            type: msg.data.tpye,
                            to: msg.data.to,
                            mes: {
                                type: mesObj.type,
                                data: mesObj.data,
                            },
                            createAt: new Date().toISOString(),
                        };
                        noTransfromRef.current = false;
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
                        const parsedList: ChatMessage[] = msg.data.map((item: any) => {
                            const mesObj = JSON.parse(decodeURIComponent(item.mes));
                            return {
                                id: item.id,
                                name: item.name,
                                type: item.type,
                                to: item.to,
                                mes: {
                                    type: mesObj.type,
                                    data: mesObj.data,
                                },
                                createAt: item.createAt,
                            };
                        });
                        if (parsedList.length < 50) {
                            setHasMore(false);
                        }

                        setListMessage((prev) => {
                            const newList = parsedList.reverse().concat(prev);
                            return newList;
                        });
                        setInitialLoading(false);
                        setFetchingMore(false);
                    } else if (msg.event === 'SEND_CHAT') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        const mesObj = JSON.parse(decodeURIComponent(msg.data.mes));
                        const newMessage: ChatMessage = {
                            id: msg.data.id,
                            name: msg.data.name,
                            type: msg.data.tpye,
                            to: msg.data.to,
                            mes: {
                                type: mesObj.type,
                                data: mesObj.data,
                            },
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
        const div = divRef.current;
        if (!div) return;
        if (listMessage.length === 0) return;
        if (page === 1 && oneTimeRef.current === true) {
            console.log('page 1 và oneTime');
            div.scrollTop = div.scrollHeight;
            oneTimeRef.current = false;
        }
        if (right) {
            console.log('right');
            div.scrollTop = div.scrollHeight;
            setRight(false);
        }

        const handleScroll = () => {
            if (div.scrollTop === 0 && hasMore && !fetchingMore) {
                setPage((prev) => {
                    const newpage = prev + 1;
                    return newpage;
                });
                noTransfromRef.current = true;
            }
        };
        div.addEventListener('scroll', handleScroll);
        return () => {
            div.removeEventListener('scroll', handleScroll);
        };
    }, [listMessage]);
    useLayoutEffect(() => {
        if (page > 1 && noTransfromRef.current === true) {
            console.log('page >1 và notranform');
            const div = divRef.current;
            if (!div) return;

            div.scrollTop = div.scrollHeight - oldScrollHeightRef.current;
        }
    }, [listMessage]);

    // const newMess =
    //     { type: 0, data: 'cuc cung' }
    // const newMess2 = { type: 0, data: 'hao han' }
    // console.log('taiabc den tai 123', encodeURIComponent(JSON.stringify(newMess)))
    // console.log('tai123 den taiabc', encodeURIComponent(JSON.stringify(newMess2)))
    // const callMess = {
    //     callMode: 'voice',
    //     status: 'calling',
    //     roomURL: `localhost:3000/call?roomID=1231212&call_mode=12121212`,
    //     roomID: '123123',
    // };
    // console.log('taiabc den tai 123', encodeURIComponent(JSON.stringify({ type: TypeMess.SIGNAL_REQUEST, data: callMess })))

    return (
        <section className="bg-[#f0f4fa] h-[calc(737.6px-72px-65px)]">
            {initialLoading ? (
                <div className="h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : listMessage.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <h2
                        className="p-2 text-center text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500
                bg-clip-text text-transparent"
                    >
                        Hãy bắt đầu nhắn tin
                    </h2>
                </div>
            ) : (
                <div
                    ref={divRef}
                    className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200"
                >
                    {fetchingMore && (
                        <div className="text-center text-sm text-gray-500 py-2">Đang tải tin nhắn cũ...</div>
                    )}
                    <ul className="p-2">
                        {listMessage.map((message, index) => {
                            // console.log('hihi  mess', message.mes);
                            // console.log('type of', typeof message.mes.data);
                            // try {
                            //     const objectMess: { type: number; data: any } = message.mes;
                            //     if (objectMess.type >= 10) {
                            //         console.log('type >= 10 nè ');

                            //         return (
                            //             <>
                            //                 {/* {objectMess.data.status === CallStatus.CALLING && (< RingingModal open={true} />)} */}
                            //                 <ContentItemCall message={message} key={index} />
                            //             </>
                            //         );
                            //     }
                            // } catch {
                            //     console.log('catch type >= 10 nè ', message.mes);
                            // }
                            return <ContentItem message={message} key={index} />;
                        })}
                    </ul>
                </div>
            )}
        </section>
    );
}

export default MainContent;
