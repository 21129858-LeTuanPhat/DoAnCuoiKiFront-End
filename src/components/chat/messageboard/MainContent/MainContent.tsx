import { useEffect, useRef, useState, useLayoutEffect } from 'react';
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
import { set } from 'firebase/database';
import { showMessageNotification } from '../../../../helps/notification';
function MainContent({
    darkMode,
    username,
    setRe,
    re,
}: {
    darkMode: boolean;
    username: any;
    setRe: React.Dispatch<React.SetStateAction<number>>;
    re: any;
}) {
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
    const {
        listMessage,
        setListMessage,
        type,
        right,
        setRight,
        setOwner,
        setListMember,
        setRecommended,
        setOpenRecommendation,
        setEncodeEmoji,
    } = useBoardContext();
    const [initialLoading, setInitialLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const oldScrollHeightRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const oneTimeRef = useRef<boolean>(true);
    const noTransfromRef = useRef<boolean>(false);
    const [callHistory, setCallHistory] = useState<Map<string, CallHistoryState>>(new Map());
    const dispatch = useDispatch();
    const [downArrow, setDownArrow] = useState<boolean>(false);
    const [notify, setNotify] = useState<boolean>(false);
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
        setRecommended({ input: '', reply: [] });
        setOpenRecommendation(false);
        divRef.current = null;
        setEncodeEmoji(false);
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
        const callMess = {
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
    };
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
                                let type = 0;
                                if (item.mes.endsWith('.png')) {
                                    type = 1;
                                } else if (
                                    item.mes.endsWith('.docx') ||
                                    item.mes.endsWith('.doc') ||
                                    item.mes.endsWith('xlsx') ||
                                    item.mes.endsWith('.xls') ||
                                    item.mes.endsWith('.pdf')
                                ) {
                                    type = 2;
                                }
                                return {
                                    id: item.id,
                                    name: item.name,
                                    type: item.type,
                                    to: item.to,
                                    mes: {
                                        type,
                                        data: item.mes,
                                    },
                                    createAt: item.createAt,
                                };
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
                        try {
                            const mesObj = JSON.parse(decodeURIComponent(msg.data.mes));
                            if (mesObj.type === TypeMess.VIDEO_CALL || mesObj.type === TypeMess.VOICE_CALL) {
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
                                        console.log('trong switch nè', mesObj.data.status);
                                        console.log(JSON.parse(decodeURIComponent(msg.data.mes)));

                                        dispatch(updateStatus({ status: CallStatus.ENDED }));
                                        console.log('Nhận được end từ người gửi');
                                        break;
                                    case CallStatus.CANCEL:
                                        dispatch(updateStatus({ status: CallStatus.CANCEL }));
                                        break;
                                    case CallStatus.TIMEOUT:
                                        console.log('trong switch  TIMEOUT nè', mesObj.data.status);
                                        dispatch(updateStatus({ status: CallStatus.TIMEOUT }));
                                        break;
                                }
                                // return;
                            } else {
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
                                if (mesObj.type === -1) {
                                    return;
                                }
                                fetch('http://127.0.0.1:8000/suggest', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ message: mesObj.data }),
                                })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        setRecommended({ input: data.input, reply: data.suggestions });
                                        setOpenRecommendation(true);
                                    })
                                    .catch((error) => {
                                        setOpenRecommendation(false);
                                    });
                                if (mesObj.type === 0) {
                                    showMessageNotification(
                                        'Webchat',
                                        msg.data.name + ':' + mesObj.data,
                                        'chat-message',
                                        {},
                                    );
                                } else {
                                    showMessageNotification(
                                        'Webchat',
                                        msg.data.name + ':' + ' gửi file ',
                                        'chat-message',
                                        {},
                                    );
                                }

                                setNotify(true);
                                noTransfromRef.current = false;
                                setListMessage((prev) => [...prev, newMessage]);
                            }
                        } catch {
                            let type = 0;
                            if (msg.data.mes.endsWith('.png')) {
                                type = 1;
                            } else if (
                                msg.data.mes.endsWith('.docx') ||
                                msg.data.mes.endsWith('.doc') ||
                                msg.data.mes.endsWith('xlsx') ||
                                msg.data.mes.endsWith('.xls') ||
                                msg.data.mes.endsWith('.pdf')
                            ) {
                                type = 2;
                            }
                            let newMessage: ChatMessage = {
                                id: msg.data.id,
                                name: msg.data.name,
                                type: msg.data.tpye,
                                to: msg.data.to,
                                mes: {
                                    type,
                                    data: msg.data.mes,
                                },
                                createAt: new Date().toISOString(),
                            };
                            fetch('http://127.0.0.1:8000/suggest', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ message: msg.data.mes }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    setRecommended({ input: data.input, reply: data.suggestions });
                                    setOpenRecommendation(true);
                                })
                                .catch((error) => {
                                    setOpenRecommendation(false);
                                });
                            if (true) {
                                showMessageNotification(
                                    'Webchat',
                                    msg.data.name + ':' + msg.data.mes,
                                    'chat-message',
                                    {},
                                );
                            } else {
                                showMessageNotification(
                                    'Webchat',
                                    msg.data.name + ':' + ' gửi file ',
                                    'chat-message',
                                    {},
                                );
                            }
                            setNotify(true);
                            noTransfromRef.current = false;
                            setListMessage((prev) => [...prev, newMessage]);
                        }
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
                        setOwner(msg.data.own);
                        setListMember(msg.data.userList);
                        const parsedList: ChatMessage[] = msg.data.chatData.map((item: any) => {
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
                                let type = 0;
                                if (item.mes.endsWith('.png')) {
                                    type = 1;
                                } else if (
                                    item.mes.endsWith('.docx') ||
                                    item.mes.endsWith('.doc') ||
                                    item.mes.endsWith('xlsx') ||
                                    item.mes.endsWith('.xls') ||
                                    item.mes.endsWith('.pdf')
                                ) {
                                    type = 2;
                                }
                                return {
                                    id: item.id,
                                    name: item.name,
                                    type: item.type,
                                    to: item.to,
                                    mes: {
                                        type,
                                        data: item.mes,
                                    },
                                    createAt: item.createAt,
                                };
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
                        try {
                            const mesObj = JSON.parse(decodeURIComponent(msg.data.mes));
                            let newMessage = {
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
                            if (mesObj.type === -1) {
                                return;
                            }
                            fetch('http://127.0.0.1:8000/suggest', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ message: mesObj.data }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    setRecommended({ input: data.input, reply: data.suggestions });
                                    setOpenRecommendation(true);
                                })
                                .catch((error) => {
                                    setOpenRecommendation(false);
                                });
                            if (mesObj.type === 0) {
                                showMessageNotification(
                                    'Webchat',
                                    msg.data.name + ':' + mesObj.data,
                                    'chat-message',
                                    {},
                                );
                            } else {
                                showMessageNotification(
                                    'Webchat',
                                    msg.data.name + ':' + ' gửi file ',
                                    'chat-message',
                                    {},
                                );
                            }

                            setNotify(true);
                            noTransfromRef.current = false;
                            setListMessage((prev) => [...prev, newMessage]);
                        } catch {
                            let type = 0;
                            if (msg.data.mes.endsWith('.png')) {
                                type = 1;
                            } else if (
                                msg.data.mes.endsWith('.docx') ||
                                msg.data.mes.endsWith('.doc') ||
                                msg.data.mes.endsWith('xlsx') ||
                                msg.data.mes.endsWith('.xls') ||
                                msg.data.mes.endsWith('.pdf')
                            ) {
                                type = 2;
                            }
                            let newMessage: ChatMessage = {
                                id: msg.data.id,
                                name: msg.data.name,
                                type: msg.data.tpye,
                                to: msg.data.to,
                                mes: {
                                    type,
                                    data: msg.data.mes,
                                },
                                createAt: new Date().toISOString(),
                            };
                            fetch('http://127.0.0.1:8000/suggest', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ message: msg.data.mes }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    setRecommended({ input: data.input, reply: data.suggestions });
                                    setOpenRecommendation(true);
                                })
                                .catch((error) => {
                                    setOpenRecommendation(false);
                                });
                            if (true) {
                                showMessageNotification(
                                    'Webchat',
                                    msg.data.name + ':' + msg.data.mes,
                                    'chat-message',
                                    {},
                                );
                            }

                            setNotify(true);
                            noTransfromRef.current = false;
                            setListMessage((prev) => [...prev, newMessage]);
                        }
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
            if (div.scrollHeight - div.scrollTop > 1000) {
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
    }, [listMessage]);
    useLayoutEffect(() => {
        if (page > 1 && noTransfromRef.current === true) {
            const div = divRef.current;
            if (!div) return;

            div.scrollTop = div.scrollHeight - oldScrollHeightRef.current;
        }
    }, [listMessage]);

    const newMess = { type: 0, data: 'cuc cung' };
    const newMess2 = { type: 0, data: 'hao han' };
    const callMess = {
        callMode: 'voice',
        status: 'calling',
        roomURL: `localhost:3000/call?roomID=1231212&call_mode=12121212`,
        roomID: '123123',
    };
    const [openReject, setReject] = useState<boolean>(false);
    return (
        <>
            <section
                className={
                    darkMode === false
                        ? 'bg-[#f0f4fa] h-[calc(737.6px-72px-65px)]'
                        : 'bg-[#111116] h-[calc(737.6px-72px-65px)]'
                }
            >
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
                        className={`h-full overflow-y-auto scrollbar-thin ${
                            darkMode === false
                                ? 'scrollbar-thumb-gray-300 scrollbar-track-gray-200'
                                : 'scrollbar-thumb-[#3b4a5f] scrollbar-track-black'
                        }`}
                    >
                        {fetchingMore && (
                            <div className="text-center text-sm text-gray-500 py-2">Đang tải tin nhắn cũ...</div>
                        )}
                        {downArrow && (
                            <div
                                onClick={handleOnDown}
                                className={
                                    notify === true
                                        ? "fixed right-8 bottom-24  z-10 p-2 bg-white rounded-full cursor-pointer  before:absolute before:content-['1+'] before:text-pink-400 before:text-sm before:-bottom-2 before:left-1 before:bg-purple-300 before:px-1 before:rounded-full "
                                        : 'fixed right-8 bottom-24  z-10 p-2 bg-white rounded-full cursor-pointer'
                                }
                            >
                                <ChevronsDown color="gray" size="30" />
                            </div>
                        )}
                        <ul className="p-2">
                            {listMessage.map((message, index) => {
                                try {
                                    const objectMess: { type: number; data: any } = message.mes;
                                    if (
                                        objectMess.type === TypeMess.VIDEO_CALL ||
                                        objectMess.type === TypeMess.VOICE_CALL
                                    ) {
                                        const history: any = callHistory.get(objectMess.data.roomID);
                                        if (objectMess.data.status === CallStatus.CALLING) {
                                            console.log('chỉ có calling nè', history);
                                            return (
                                                <ContentItemCall message={message} history={history}></ContentItemCall>
                                            );
                                        }
                                    }
                                    if (objectMess.type < 10) {
                                        return <Content darkMode={darkMode} message={message} key={index} />;
                                    }
                                } catch {
                                    return <Content darkMode={darkMode} message={message} key={index} />;
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
