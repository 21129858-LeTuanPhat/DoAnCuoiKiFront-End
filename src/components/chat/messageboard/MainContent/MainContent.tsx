import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import WebSocketManager from '../../../../socket/WebSocketManager';
import ContentItem from '../MainContent/ContentItem';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { ChatMessage, TypeMess } from '../../../../model/ChatMessage';
import ContentItemCall from '../ItemCall';
import RingingModal from '../../../modal/RingingModal';
import { CallInterface, CallStatus } from '../../../../model/CallProps';
import { useDispatch, useSelector } from 'react-redux';
import { incomingCall, ReducerCall, updateStatus } from '../../../../redux/callReducer';
import RejectModal from '../../../modal/RejectModal';
import { RootState } from '../../../../redux/store';
import { REACT_BASE_URL } from '../../../../config/utils';
import { useLocation, useNavigate } from 'react-router-dom';

function MainContent({ username }: any) {
    const selection = useSelector((state: RootState) => state.call)
    const [page, setPage] = useState<number>(1);
    const divRef = useRef<HTMLDivElement>(null);
    const { listMessage, setListMessage, type, selectedUser } = useBoardContext();
    const [initialLoading, setInitialLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const oldScrollHeightRef = useRef(0);
    const dispatch = useDispatch()

    const paddingTop = 50;
    const paddingLeft = 100;
    const width = window.innerWidth - paddingLeft * 2;
    const height = window.innerHeight - paddingTop * 2;

    useEffect(() => {
        console.log('useeff1');
        setListMessage([]);
        setPage(1);
    }, [username]);
    const selectionRef = useRef<ReducerCall>({
        callStatus: CallStatus.IDLE,
        isIncoming: false,
        caller: null,
        callMode: undefined,
        roomID: undefined,
        roomURL: undefined,
    });

    useEffect(() => {
        selectionRef.current = selection;
    }, [selection]);
    console.log('selection trong mainContent', selection, 'roomid: ', selection.roomID, 'selection.callMode: ', selection.callMode)
    const sendInCall = () => {
        const callSelection = selectionRef.current
        const ws = WebSocketManager.getInstance();
        const callMess = {
            status: CallStatus.IN_CALL,
            roomURL: `${REACT_BASE_URL}/call?roomID=${callSelection.roomID}&call_mode=${callSelection.callMode}`,
            roomID: callSelection.roomID,
        };
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: encodeURIComponent(JSON.stringify({ type: selectionRef.current.callMode, data: callMess })),
                    },
                },
            }),
        );
        console.log('vao function sendincall nè', JSON.stringify({
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: type,
                    to: selectedUser,
                    mes: (JSON.stringify({ type: selectionRef.current.callMode, data: callMess })),
                },
            },
        }),)
    }
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        if (page === 1) {
            setInitialLoading(true);
        } else {
            setFetchingMore(true);
        }
        if (type === 'people') {
            ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
                console.log('msg nè', msg)
                if (msg.status === 'success' && msg.event === 'SEND_CHAT') {

                    const mesObj: any = JSON.parse(decodeURIComponent(msg.data.mes));
                    console.log('msg nhận về nè', mesObj)

                    if (mesObj.type === TypeMess.VIDEO_CALL || mesObj.type === TypeMess.VOICE_CALL) {
                        // const newCallMessage: ChatMessage = {
                        //     id: msg.data.id,
                        //     name: msg.data.name,
                        //     type: msg.data.type, 
                        //     to: msg.data.to,
                        //     mes: {
                        //         type: mesObj.type,
                        //         data: mesObj.data,
                        //     },
                        //     createAt: new Date().toISOString(),
                        // };
                        // setListMessage((prev) => [...prev, newCallMessage]);
                        // Xử lý các trạng thái
                        switch (mesObj.data.status) {
                            case CallStatus.CALLING:
                                console.log('trong switch nè', mesObj.data.status)
                                dispatch(incomingCall({
                                    roomURL: mesObj.data.roomURL,
                                    roomID: mesObj.data.roomID,
                                    caller: msg.data.name,
                                    callMode: mesObj.type === TypeMess.VIDEO_CALL ? TypeMess.VIDEO_CALL : TypeMess.VOICE_CALL,
                                }))
                                break;
                            case CallStatus.REJECT:
                                console.log('trong switch nè', mesObj.data.status)
                                dispatch(updateStatus({ status: CallStatus.REJECT }))
                                break;
                            case CallStatus.CONNECTING:
                                console.log('trong switch nè', mesObj.data.status)
                                console.log('Nhận được CONNECTING, gửi IN_CALL')
                                setTimeout(() => {
                                    sendInCall()
                                    dispatch(updateStatus({ status: CallStatus.IN_CALL }))
                                }, 100)
                                break;
                            case CallStatus.IN_CALL:
                                console.log('trong switch nè', mesObj.data.status)
                                dispatch(updateStatus({ status: CallStatus.IN_CALL }))
                                console.log('Nhận được IN_CALL từ người gửi')
                                break;
                            case CallStatus.ENDED:
                                console.log('trong switch nè', mesObj.data.status)
                                dispatch(updateStatus({ status: CallStatus.ENDED }))
                                console.log('Nhận được end từ người gửi')
                                break;
                            case CallStatus.CANCEL:
                                dispatch(updateStatus({ status: CallStatus.CANCEL }))
                                break;
                        }
                        return;
                    }
                }
                if (msg.status === 'success') {
                    if (msg.event === 'GET_PEOPLE_CHAT_MES') {
                        console.log('GET_PEOPLE_CHAT_MES nè')
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        const parsedList: ChatMessage[] = msg.data.map((item: any) => {
                            try {
                                const mesObj = JSON.parse(decodeURIComponent(item.mes));
                                console.log('mess obj', mesObj)
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
                                console.log('lỗi catch', item)
                            }

                        });
                        console.log("parsedList", parsedList)
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
    console.log('list mess nè', listMessage)
    const filterListMess = (messages: ChatMessage[]) => {
        const lastCallByRoomID = new Map<string, ChatMessage>();
        const otherMessages: ChatMessage[] = [];

        // Duyệt qua tất cả messages
        messages.forEach((item) => {
            // Kiểm tra nếu là VIDEO_CALL hoặc VOICE_CALL
            if (
                item.mes.type === TypeMess.VIDEO_CALL ||
                item.mes.type === TypeMess.VOICE_CALL
            ) {
                try {
                    // Parse data để lấy roomID
                    const callData: any = item.mes.data;
                    const roomID = callData.roomID;
                    console.log('roomID nè', roomID)
                    if (roomID) {
                        // Luôn cập nhật để lấy message cuối cùng (vì đã sort)
                        lastCallByRoomID.set(roomID, item);
                    }
                } catch (error) {
                    console.error('Error parsing message data:', error);
                    // Nếu parse lỗi thì vẫn giữ lại message này
                    otherMessages.push(item);
                }
            } else {
                // Các loại message khác thì giữ nguyên
                otherMessages.push(item);
            }
        });

        // Kết hợp: messages khác + messages call cuối cùng theo roomID
        const callMessages = Array.from(lastCallByRoomID.values());

        return [...otherMessages, ...callMessages];
    };
    useEffect(() => {
        console.log('e3');
        const div = divRef.current;
        if (!div) return;
        if (listMessage.length === 0) return;

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
    console.log('list mess nè', listMessage)

    const newMess =
        { type: 0, data: 'cuc cung' }
    const newMess2 = { type: 0, data: 'hao han' }
    console.log('taiabc den tai 123', encodeURIComponent(JSON.stringify(newMess)))
    console.log('tai123 den taiabc', encodeURIComponent(JSON.stringify(newMess2)))
    const callMess = {
        callMode: 'voice',
        status: 'calling',
        roomURL: `localhost:3000/call?roomID=1231212&call_mode=12121212`,
        roomID: '123123',
    };
    console.log('taiabc den tai 123', encodeURIComponent(JSON.stringify({ type: TypeMess.VIDEO_CALL, data: callMess })))
    const [openReject, setReject] = useState<boolean>(false)
    return (
        <>
            {selection.callStatus === CallStatus.REJECT && (<RejectModal open={true}></RejectModal>)}
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
                                const objectMess: { type: number, data: any } = message.mes
                                if (objectMess.type >= 10) {
                                    return (
                                        <>
                                            {/* {objectMess.data.status === CallStatus.CALLING && (< RingingModal open={true} />)} */}
                                            <ContentItemCall message={message} key={index} />
                                        </>
                                    );
                                }
                                return <ContentItem message={message} key={index} />;
                            })}
                        </ul>
                    </div>
                )}
            </section></>
    );
}

export default MainContent;
