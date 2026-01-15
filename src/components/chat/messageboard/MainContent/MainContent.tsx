import { useEffect, useRef, useState, useLayoutEffect, useContext } from 'react';
import WebSocketManager from '../../../../socket/WebSocketManager';
import Content from './Content';
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
import CallModal from '../../../modal/CallModal';
import ContentItem from './ContentItem';
import { ChevronsDown } from 'lucide-react';
import { CallContext } from '../../../../pages/ChatAppPage';
import LocationItem from './LocationItem';
function MainContent({ username, setRe, re }: { username: any, setRe: React.Dispatch<React.SetStateAction<number>>, re: any }) {

    interface CallHistoryState {
        roomID: string;
        callMode: number;
        caller: string;
        lastStatus: string;
        duration?: number;
    }

    const selection = useSelector((state: RootState) => state.call);
    const [page, setPage] = useState<number>(1);
    const divRef = useRef<HTMLDivElement>(null);
    const { listMessage, setListMessage, type, right, setRight, setOwner, setListMember, selectedUser } = useBoardContext();
    const [initialLoading, setInitialLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const oldScrollHeightRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);

    const oneTimeRef = useRef<boolean>(true);
    const noTransfromRef = useRef<boolean>(false);
    const [callHistory, setCallHistory] = useState<Map<string, CallHistoryState>>(new Map());
    const dispatch = useDispatch();
    const [downArrow, setDownArrow] = useState<boolean>(false);
    const [notify, setNotify] = useState<boolean>(false)
    const context = useContext(CallContext)



    const handleOnDown = () => {
        const div = divRef.current;
        if (!div) return;
        div.scrollTop = div.scrollHeight;
        setNotify(false);
    };
    useEffect(() => {
        const callMessages = listMessage.filter((msg) => msg.mes.type >= 10);

        if (callMessages.length === 0) return;

        setCallHistory((prev) => {
            const newHistory = new Map(prev);

            callMessages.forEach((message) => {
                const dataCall: any = message.mes.data;
                const roomID: any = dataCall.roomID;
                const status = dataCall.status;
                const existing = newHistory.get(roomID);

                if (!existing) {
                    if (status === 'calling') {
                        newHistory.set(roomID, {
                            roomID,
                            callMode: message.mes.type,
                            caller: message.name as string,
                            lastStatus: status,
                        });
                    }
                } else {
                    const currentMsg = callMessages.find((m) => {
                        const data: any = m.mes?.data;
                        if (!data) return false;
                        return data.roomID === roomID && data.status === existing.lastStatus;
                    });

                    if (!currentMsg || message.id > currentMsg.id) {
                        newHistory.set(roomID, {
                            ...existing,
                            lastStatus: status,
                            ...(status === CallStatus.ENDED && { duration: dataCall.duration }),
                        });
                    }
                }
            });

            return newHistory;
        });
    }, [listMessage]);

    useLayoutEffect(() => {
        setListMessage([]);
        setPage(1);
    }, [username]);
    const selectionRef = useRef<ReducerCall>({
        callStatus: CallStatus.IDLE,
        isIncoming: false,
        caller: null,
        type: undefined,
        callMode: undefined,
        roomID: undefined,
        roomURL: undefined,
    });

    useEffect(() => {
        selectionRef.current = selection;
    }, [selection]);
    console.log(
        'selection trong mainContent',
        selection,
        'roomid: ',
        selection.roomID,
        'selection.callMode: ',
        selection.callMode,
    );
    const sendInCall = () => {
        const callSelection = selectionRef.current;
        const ws = WebSocketManager.getInstance();
        const username = localStorage.getItem('username');

        // Thêm field 'from' nếu là room call
        const callMess = callSelection.type === 'room' ? {
            status: CallStatus.IN_CALL,
            roomURL: `/call?roomID=${callSelection.roomID}&call_mode=${callSelection.callMode}`,
            roomID: callSelection.roomID,
            from: callSelection.caller, // Người gọi ban đầu (KHÔNG phải người gửi IN_CALL)
        } : {
            status: CallStatus.IN_CALL,
            roomURL: `/call?roomID=${callSelection.roomID}&call_mode=${callSelection.callMode}`,
            roomID: callSelection.roomID,
        };

        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: selectionRef.current.type,
                        to: selectionRef.current.caller,
                        mes: encodeURIComponent(
                            JSON.stringify({ type: selectionRef.current.callMode, data: callMess }),
                        ),
                    },
                },
            }),
        );
        console.log('bên trong inCall của a', JSON.stringify({
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: selectionRef.current.type,
                    to: selectionRef.current.caller,
                    mes:
                        JSON.stringify({ type: selectionRef.current.callMode, data: callMess }),

                },
            },
        }),)
    };
    useLayoutEffect(() => {
        const ws = WebSocketManager.getInstance();
        if (page === 1) {
            setInitialLoading(true);
        } else {
            setFetchingMore(true);
        }
        if (type === 'people') {
            ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
                console.log('msg maincontent people', msg)
                if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
                    const mesObj: any = JSON.parse(decodeURIComponent(msg.data.mes));
                    if (mesObj.type === TypeMess.VIDEO_CALL || mesObj.type === TypeMess.VOICE_CALL) {
                        if (msg.data.type === 0) {


                            switch (mesObj.data.status) {
                                case CallStatus.CALLING:
                                    console.log('trong switch nè', mesObj.data.status);
                                    dispatch(
                                        incomingCall({
                                            roomURL: mesObj.data.roomURL,
                                            roomID: mesObj.data.roomID,
                                            caller: msg.data.name,
                                            callMode:
                                                mesObj.type === TypeMess.VIDEO_CALL
                                                    ? TypeMess.VIDEO_CALL
                                                    : TypeMess.VOICE_CALL,
                                            type: msg.data.type === 0 ? 'people' : 'room',
                                        }),
                                    );
                                    break;
                                case CallStatus.REJECT:
                                    console.log('trong switch  REJECT nè', mesObj.data.status);
                                    dispatch(updateStatus({ status: CallStatus.REJECT }));
                                    break;
                                case CallStatus.CONNECTING:
                                    console.log('trong switch nè', mesObj.data.status);
                                    console.log('Nhận được CONNECTING, gửi IN_CALL');
                                    setTimeout(() => {
                                        sendInCall();
                                        dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                    }, 100);
                                    break;
                                case CallStatus.IN_CALL:
                                    console.log('trong switch nè', mesObj.data.status);
                                    dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                    console.log('Nhận được IN_CALL từ người gửi');
                                    break;
                                case CallStatus.ENDED:
                                    console.log('trong switch nè', mesObj.data.status)
                                    console.log(JSON.parse(decodeURIComponent(msg.data.mes)))

                                    dispatch(updateStatus({ status: CallStatus.ENDED }))
                                    console.log('Nhận được end từ người gửi')
                                    break;
                                case CallStatus.CANCEL:
                                    dispatch(updateStatus({ status: CallStatus.CANCEL }));
                                    break;
                                case CallStatus.TIMEOUT:
                                    console.log('trong switch  TIMEOUT nè', mesObj.data.status);
                                    dispatch(updateStatus({ status: CallStatus.TIMEOUT }));
                                    break;
                            }
                        }
                        return;
                    }
                }
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
                        setNotify(true);
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
                console.log('msg maincontent room', msg)
                if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
                    const mesObj: any = JSON.parse(decodeURIComponent(msg.data.mes));
                    if (mesObj.type === TypeMess.VIDEO_CALL || mesObj.type === TypeMess.VOICE_CALL) {

                        if (msg.data.type === 1) {

                            switch (mesObj.data.status) {
                                case CallStatus.CALLING:
                                    console.log('trong switch nè', mesObj.data.status);
                                    dispatch(
                                        incomingCall({
                                            roomURL: mesObj.data.roomURL,
                                            roomID: mesObj.data.roomID,
                                            caller: msg.data.type === 1 ? msg.data.to : msg.data.name,
                                            callMode:
                                                mesObj.type === TypeMess.VIDEO_CALL
                                                    ? TypeMess.VIDEO_CALL
                                                    : TypeMess.VOICE_CALL,
                                            type: msg.data.type === 0 ? 'people' : 'room',
                                        }),
                                    );
                                    break;
                                case CallStatus.REJECT:
                                    // Group Call: Always ignore REJECT. One person rejecting shouldn't stop the call.
                                    console.log('Group Call: Ignored REJECT from', msg.data.name);
                                    break;
                                case CallStatus.CONNECTING:
                                    console.log('Group Call: Nhận CONNECTING từ:', msg.data.name, '(người gửi), from:', mesObj.data.from, '(người gọi ban đầu), callStatus:', selectionRef.current.callStatus);
                                    if (!context) return;
                                    // Bỏ qua message từ chính mình (dùng msg.data.name - người gửi message)
                                    const myUsernameConnecting = localStorage.getItem('username');
                                    if (msg.data.name === myUsernameConnecting) {
                                        console.log('Bỏ qua CONNECTING từ chính mình');
                                        break;
                                    }

                                    // User A (người gọi - đang CALLING): Nhận CONNECTING từ B → Gửi IN_CALL và vào room
                                    if (selectionRef.current.callStatus === CallStatus.CALLING && !context.refStatusIncall.current) {
                                        console.log('Người gọi nhận CONNECTING, gửi IN_CALL và vào room');
                                        setTimeout(() => {
                                            sendInCall();
                                            dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                        }, 100);
                                    }
                                    // else if (selection.callStatus === CallStatus.CONNECTING && !context.refStatusIncall.current) {
                                    //     console.log('Mình cũng đã accept, gửi IN_CALL');
                                    //     setTimeout(() => {
                                    //         sendInCall();
                                    //         dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                    //     }, 100);
                                    //       dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                    // }
                                    else if (selectionRef.current.callStatus === CallStatus.RINGING) {
                                        context.refStatusIncall.current = true;
                                        console.log('Người khác đã accept, nhưng mình vẫn đang ringing - KHÔNG tự động join');

                                    }
                                    else if (selectionRef.current.callStatus === CallStatus.IDLE) {
                                        context.refStatusIncall.current = true;
                                        console.log('Nhận CONNECTING khi vẫn đang IDLE - Đánh dấu có người đã vào');

                                    }
                                    else if (selectionRef.current.callStatus === CallStatus.IN_CALL) {
                                        console.log('Đã IN_CALL rồi, bỏ qua CONNECTING');
                                    }
                                    else {
                                        console.log('Trường hợp khác - callStatus:', selectionRef.current.callStatus, 'refStatusIncall:', context.refStatusIncall.current);
                                    }
                                    break;
                                case CallStatus.IN_CALL:
                                    console.log('Nhận IN_CALL từ:', msg.data.name, '(người gửi), from:', mesObj.data.from, '(người gọi ban đầu), callStatus:', selectionRef.current.callStatus);
                                    if (!context) return;


                                    const myUsernameInCall = localStorage.getItem('username');
                                    if (msg.data.name === myUsernameInCall) {
                                        console.log('Bỏ qua IN_CALL từ chính mình');
                                        break;
                                    }

                                    if (selectionRef.current.callStatus === CallStatus.CONNECTING && !context.refStatusIncall.current) {
                                        dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                    }
                                    else if (selectionRef.current.callStatus === CallStatus.RINGING) {
                                        context.refStatusIncall.current = true;
                                        console.log('Người khác đã vào call, nhưng mình vẫn đang ringing');

                                    }
                                    else {
                                        context.refStatusIncall.current = true;
                                    }
                                    break;
                                case CallStatus.ENDED:
                                    console.log('trong switch nè', mesObj.data.status)
                                    console.log(JSON.parse(decodeURIComponent(msg.data.mes)))
                                    dispatch(updateStatus({ status: CallStatus.ENDED }))
                                    console.log('Nhận được end từ người gửi')
                                    break;
                                case CallStatus.CANCEL:
                                    dispatch(updateStatus({ status: CallStatus.CANCEL }));
                                    break;
                                case CallStatus.TIMEOUT:
                                    console.log('trong switch  TIMEOUT nè', mesObj.data.status);
                                    dispatch(updateStatus({ status: CallStatus.TIMEOUT }));
                                    break;
                            }
                        }
                        return;
                    }
                }
                if (msg.status === 'success') {
                    if (msg.event === 'GET_ROOM_CHAT_MES') {
                        oldScrollHeightRef.current = divRef.current?.scrollHeight || 0;
                        setOwner(msg.data.own);
                        setListMember(msg.data.userList);
                        const parsedList: ChatMessage[] = msg.data.chatData.map((item: any) => {
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
                        setNotify(true);
                        noTransfromRef.current = false;
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

    useLayoutEffect(() => {
        const div = divRef.current;
        if (!div) return;
        if (listMessage.length === 0) return;

        if (page === 1 && oneTimeRef.current === true && div.scrollHeight > div.clientHeight) {
            div.scrollTop = div.scrollHeight;
            oneTimeRef.current = false;
        }
        if (right || div.scrollHeight - div.scrollTop < 700) {
            div.scrollTop = div.scrollHeight;
            setNotify(false);
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
            if (div.scrollHeight - div.scrollTop > 2000) {
                setDownArrow(true);
            }
            if (div.scrollHeight - div.scrollTop < 700) {
                setDownArrow(false);
                setNotify(false);
            }
        };
        div.addEventListener('scroll', handleScroll);
        return () => {
            div.removeEventListener('scroll', handleScroll);
        };
    }, [listMessage, re]);
    useLayoutEffect(() => {
        if (page > 1 && noTransfromRef.current === true) {
            const div = divRef.current;
            if (!div) return;

            div.scrollTop = div.scrollHeight - oldScrollHeightRef.current;
        }
    }, [listMessage]);
    console.error('đây là trang main content', selectedUser)

    return (
        <>
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
                        {downArrow && (
                            <div
                                onClick={handleOnDown}
                                className={
                                    notify === true
                                        ? "fixed right-8 bottom-24  z-5 p-2 bg-white rounded-full cursor-pointer  before:absolute before:content-['1+'] before:text-pink-400 before:text-sm before:-bottom-2 before:left-1 before:bg-purple-300 before:px-1 before:rounded-full "
                                        : 'fixed right-8 bottom-24  z-5 p-2 bg-white rounded-full cursor-pointer'
                                }
                            >
                                <ChevronsDown color="gray" size="30" />
                            </div>
                        )}
                        <ul className="p-2">
                            {listMessage.map((message, index) => {
                                const objectMess: { type: number; data: any } = message.mes;
                                if (
                                    objectMess.type === TypeMess.VIDEO_CALL ||
                                    objectMess.type === TypeMess.VOICE_CALL
                                ) {
                                    const history: any = callHistory.get(objectMess.data.roomID);
                                    if (objectMess.data.status === CallStatus.CALLING) {
                                        // console.log('chỉ có calling nè', history);
                                        return <ContentItemCall message={message} history={history}></ContentItemCall>;
                                    }
                                }
                                if (objectMess.type === 99) {
                                    return <LocationItem message={message} key={index} />;
                                }
                                if (objectMess.type < 10) {
                                    return <Content message={message} key={index} />;
                                }
                            })}
                        </ul>
                    </div>
                )}
            </section>
        </>
    );
}

export default MainContent;