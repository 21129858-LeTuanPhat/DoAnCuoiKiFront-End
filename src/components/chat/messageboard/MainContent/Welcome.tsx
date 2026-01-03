import { MessageCircleMore } from 'lucide-react';
import { useEffect, useRef } from 'react';
import WebSocketManager from '../../../../socket/WebSocketManager';
import { TypeMess } from '../../../../model/ChatMessage';
import { CallStatus } from '../../../../model/CallProps';
import { useDispatch, useSelector } from 'react-redux';
import { incomingCall, ReducerCall, updateStatus } from '../../../../redux/callReducer';
import { RootState } from '../../../../redux/store';
import { REACT_BASE_URL } from '../../../../config/utils';
function Welcome() {
    const dispatch = useDispatch()

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
                        type: 1,
                        to: selection.caller,
                        mes: encodeURIComponent(JSON.stringify({ type: selectionRef.current.callMode, data: callMess })),
                    },
                },
            }),
        );
    }
    // useEffect(() => {
    //     const ws = WebSocketManager.getInstance();
    //     ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
    //         if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
    //             const mesObj: any = JSON.parse(decodeURIComponent(msg.data.mes));
    //             if (mesObj.type === TypeMess.VIDEO_CALL || mesObj.type === TypeMess.VOICE_CALL) {
    //                 switch (mesObj.data.status) {
    //                     case CallStatus.CALLING:
    //                         console.log('trong switch nè', mesObj.data.status)
    //                         dispatch(incomingCall({
    //                             roomURL: mesObj.data.roomURL,
    //                             roomID: mesObj.data.roomID,
    //                             caller: msg.data.name,
    //                             callMode: mesObj.type === TypeMess.VIDEO_CALL ? TypeMess.VIDEO_CALL : TypeMess.VOICE_CALL,
    //                             type: msg.data.type
    //                         }))
    //                         break;
    //                     case CallStatus.REJECT:
    //                         console.log('trong switch nè', mesObj.data.status)
    //                         dispatch(updateStatus({ status: CallStatus.REJECT }))
    //                         break;
    //                     case CallStatus.CONNECTING:
    //                         console.log('trong switch nè', mesObj.data.status)
    //                         console.log('Nhận được CONNECTING, gửi IN_CALL')
    //                         setTimeout(() => {
    //                             sendInCall()
    //                             dispatch(updateStatus({ status: CallStatus.IN_CALL }))
    //                         }, 100)
    //                         break;
    //                     case CallStatus.IN_CALL:
    //                         console.log('trong switch nè', mesObj.data.status)
    //                         dispatch(updateStatus({ status: CallStatus.IN_CALL }))
    //                         console.log('Nhận được IN_CALL từ người gửi')
    //                         break;
    //                     case CallStatus.ENDED:
    //                         console.log('trong switch nè', mesObj.data.status)
    //                         dispatch(updateStatus({ status: CallStatus.ENDED }))
    //                         console.log('Nhận được end từ người gửi')
    //                         break;
    //                     case CallStatus.CANCEL:
    //                         dispatch(updateStatus({ status: CallStatus.CANCEL }))
    //                         break;
    //                     case CallStatus.TIMEOUT:
    //                         dispatch(updateStatus({ status: CallStatus.TIMEOUT }))
    //                         break;
    //                 }
    //                 return;
    //             }
    //         }
    //     })
    // }, [])

    return (
        <div className="flex flex-col justify-center items-center h-full">
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
                            className="fill-purple-200 origin-center animate-scale-pulse"
                        ></circle>
                    </svg>
                    <div
                        className="absolute 
                                    w-[100px] h-[100px]
                                    rounded-full object-cover
                                    top-1/2 left-1/2 
                                    -translate-x-1/2 -translate-y-1/2
                                    bg-gradient-to-br from-purple-500 to-pink-500 
                                    flex justify-center items-center
                                    "
                    >
                        <MessageCircleMore className="text-white w-[30px] h-[30px]" />
                    </div>
                </div>
                <h2
                    className=" p-2 text-center text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 
                        bg-clip-text text-transparent"
                >
                    Chào mừng bạn đến với Moji!
                </h2>
                <h4 className="my-3 text-center text-slate-500">Chọn một cuộc hội thoại để bắt đầu!</h4>
            </div>
        </div>
    );
}

export default Welcome;
