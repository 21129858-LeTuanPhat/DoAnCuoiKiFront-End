import { MessageCircleMore } from 'lucide-react';
import { useContext, useEffect, useRef } from 'react';
import WebSocketManager from '../../../../socket/WebSocketManager';
import { TypeMess } from '../../../../model/ChatMessage';
import { CallStatus } from '../../../../model/CallProps';
import { useDispatch, useSelector } from 'react-redux';
import { incomingCall, ReducerCall, updateStatus } from '../../../../redux/callReducer';
import { RootState } from '../../../../redux/store';
import { REACT_BASE_URL } from '../../../../config/utils';

import { CallContext } from '../../../../pages/ChatAppPage';
function Welcome({ darkMode }: { darkMode: boolean }) {
    const dispatch = useDispatch()
    const context = useContext(CallContext)
    const selection = useSelector((state: RootState) => state.call)
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
    const sendInCall = () => {
        const callSelection = selectionRef.current;
        const ws = WebSocketManager.getInstance();
        const username = localStorage.getItem('username');

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

    };
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
            if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
                const mesObj: any = JSON.parse(decodeURIComponent(msg.data.mes));
                if (mesObj.type === TypeMess.VIDEO_CALL || mesObj.type === TypeMess.VOICE_CALL) {
                    if (msg.data.type === 0) {
                        switch (mesObj.data.status) {
                            case CallStatus.CALLING:
                                console.log('trong switch nè', mesObj.data.status);
                                if (selectionRef.current.callStatus === CallStatus.IN_CALL) {
                                    console.log('Đang trong cuộc gọi, gửi BUSY');
                                    const ws = WebSocketManager.getInstance();
                                    ws.sendMessage(
                                        JSON.stringify({
                                            action: 'onchat',
                                            data: {
                                                event: 'SEND_CHAT',
                                                data: {
                                                    type: 'people',
                                                    to: msg.data.name,
                                                    mes: encodeURIComponent(
                                                        JSON.stringify({
                                                            type: mesObj.type,
                                                            data: {
                                                                status: CallStatus.BUSY,
                                                                roomID: mesObj.data.roomID
                                                            }
                                                        }),
                                                    ),
                                                },
                                            },
                                        }),
                                    );
                                    return;
                                }
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
                            case CallStatus.BUSY:
                                dispatch(updateStatus({ status: CallStatus.BUSY }));
                                break;
                        }
                    }
                    else if (msg.data.type === 1) {
                        switch (mesObj.data.status) {
                            case CallStatus.CALLING:
                                console.log('trong switch nè', mesObj.data.status);
                                if (msg.data.name === localStorage.getItem('username')) {
                                    return;
                                }
                                if (selectionRef.current.callStatus === CallStatus.IN_CALL) {
                                    return;
                                }

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
                                console.log('Group Call: Ignored REJECT from', msg.data.name);
                                break;
                            case CallStatus.CONNECTING:
                                console.log('Group Call: Nhận CONNECTING từ:', msg.data.name, '(người gửi), from:', mesObj.data.from, '(người gọi ban đầu), callStatus:', selectionRef.current.callStatus);
                                if (!context) return;
                                const myUsernameConnecting = localStorage.getItem('username');
                                if (msg.data.name === myUsernameConnecting) {
                                    console.log('Bỏ qua CONNECTING từ chính mình');
                                    break;
                                }

                                if (selectionRef.current.callStatus === CallStatus.CALLING && !context.refStatusIncall.current) {
                                    console.log('Người gọi nhận CONNECTING, gửi IN_CALL và vào room');
                                    setTimeout(() => {
                                        sendInCall();
                                        dispatch(updateStatus({ status: CallStatus.IN_CALL }));
                                    }, 100);
                                }

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
                                if (selectionRef.current.callStatus === CallStatus.IDLE) {
                                    return
                                }
                                console.log('trong switch nè', mesObj.data.status)
                                console.log(JSON.parse(decodeURIComponent(msg.data.mes)))
                                dispatch(updateStatus({ status: CallStatus.ENDED }))
                                console.log('Nhận được end từ người gửi')
                                break;
                            case CallStatus.CANCEL:
                                if (selectionRef.current.callStatus === CallStatus.RINGING) {
                                    dispatch(updateStatus({ status: CallStatus.CANCEL }));
                                }

                                break;
                            case CallStatus.TIMEOUT:
                                console.log('trong switch  TIMEOUT nè', mesObj.data.status);
                                dispatch(updateStatus({ status: CallStatus.TIMEOUT }));
                                break;
                            case CallStatus.BUSY:
                                console.log('Users are busy');
                                dispatch(updateStatus({ status: CallStatus.BUSY }));
                                break;
                        }
                        }
                        return;
                    }
                }
            } catch {
                return;
            }
        })
        return () => {
            ws.unSubcribe('GET_PEOPLE_CHAT_MES');
        };
    }, [])
    console.error('đây là trang welcome')

    return (
        <div
            className={
                darkMode === false
                    ? 'flex flex-col justify-center items-center h-full'
                    : 'flex flex-col justify-center items-center h-full bg-[#111116]'
            }
        >
            <div>
                <div className="relative w-full max-w-[250px] aspect-square flex items-center justify-center m-auto">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 500 500"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <circle
                            cx="250"
                            cy="250"
                            r="160"
                            className={
                                darkMode === false
                                    ? 'fill-purple-200 origin-center animate-scale-pulse'
                                    : 'fill-blue-200 origin-center animate-scale-pulse'
                            }
                        ></circle>
                    </svg>
                    <div
                        className={`absolute 
                                    w-[100px] h-[100px]
                                    rounded-full object-cover
                                    top-1/2 left-1/2 
                                    -translate-x-1/2 -translate-y-1/2
                                    bg-gradient-to-br 
                                    ${darkMode === false ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-pink-500'}
                                    flex justify-center items-center `}
                    >
                        <MessageCircleMore className="text-white w-[30px] h-[30px]" />
                    </div>
                </div>
                <h2
                    className={
                        darkMode === false
                            ? ' p-2 text-center text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'
                            : ' p-2 text-center text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent'
                    }
                >
                    Chào mừng bạn đến với Moji!
                </h2>
                <h4 className="my-3 text-center text-slate-500">Chọn một cuộc hội thoại để bắt đầu!</h4>
            </div>
        </div>
    );
}

export default Welcome;