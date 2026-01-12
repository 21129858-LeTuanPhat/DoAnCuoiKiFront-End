import { Camera, Phone } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChatMessage, TypeMess } from '../../../model/ChatMessage'
import { useBoardContext } from '../../../hooks/useBoardContext';
import { CallStatus } from '../../../model/CallProps';
import WebSocketManager from '../../../socket/WebSocketManager';
import { CallContext, ICallContext } from '../../../pages/ChatAppPage';
interface CallHistoryState {
    roomID: string;
    callMode: number,
    caller: string;
    lastStatus: string;
    duration?: number
}
interface LastHistory {
    status: string,
    duration?: string
}
export default function ContentItemCall({ message, history }: { message: ChatMessage, history: any }) {
    const { selectedUser, type } = useBoardContext();
    const username = localStorage.getItem('username')
    const context = useContext(CallContext)
    if (!context) {
        throw new Error("Ko thấy context call")
    }

    const { setModalCalling, setTypeCalling } = context
    console.log('status trong call nè', message.mes.data)
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [lastHistory, setLastHistory] = useState<LastHistory>()
    const status = useRef<string | undefined>(undefined)
    // console.log('lastHistory nè', history.lastStatus)
    useEffect(() => {
        if (!history) return
        console.log('lastHistory nè', history.lastStatus)
        status.current = history.lastStatus
        if (history.lastStatus === CallStatus.CANCEL) {

            setLastHistory({ status: 'Cuộc gọi nhỡ' })
        }
        if (history.lastStatus === CallStatus.REJECT) {
            setLastHistory({ status: 'Cuộc gọi đã bị từ chối' })
        }
        if (history.lastStatus === CallStatus.ENDED) {
            setLastHistory({ status: 'Cuộc gọi thoại', duration: formatTime(Number(history.duration)) })
        }
        if (history.lastStatus === CallStatus.TIMEOUT) {
            setLastHistory({ status: 'Đã bỏ lỡ cuộc gọi' })
        }

    }, [history])

    // ws.sendMessage(
    //     JSON.stringify({
    //         action: 'onchat',
    //         data: {
    //             event: 'SEND_CHAT',
    //             data: {
    //                 type: type,
    //                 to: selectedUser,
    //                 mes: encodeURIComponent(JSON.stringify({ type: refSendMess.current.callMode, data: timeout })),
    //             },
    //         },
    //     }),
    // );
    // const callMess = {
    //     status: CallStatus.CANCEL,
    //     roomURL: `/call?roomID=${refSendMess.current.roomID}&call_mode=${refSendMess.current.callMode}`,
    //     roomID: refSendMess.current.roomID,
    // };
    const hanldeVoice = () => {
        setModalCalling(true);
        setTypeCalling(TypeMess.VOICE_CALL);
    };
    const hanldeVideo = () => {
        setModalCalling(true);
        setTypeCalling(TypeMess.VIDEO_CALL);
    };
    const handleCall = () => {
        if (message.mes.type === TypeMess.VOICE_CALL) {
            hanldeVoice()
        }
        if (message.mes.type === TypeMess.VIDEO_CALL) {
            hanldeVideo()
        }
    }

    return type === 'people' ? (selectedUser === message.name ? (<div className="mt-4 flex items-end w-full ">
        <img
            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
            alt="hình ảnh"
            className="rounded-full w-8 h-8 mr-2 align-bottom   "
        />
        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            <div className="flex items-start gap-4 mb-2">
                {(status.current === CallStatus.REJECT || status.current === CallStatus.CANCEL || status.current === CallStatus.TIMEOUT) ?
                    (<div className=" rounded-full p-3" style={{ backgroundColor: 'rgb(243, 66, 95)' }}>
                        {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-white" />) : (<Phone className="w-5 h-5 text-white" />)}
                    </div>) :
                    (<div className="bg-gray-100 rounded-full p-3">
                        {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-gray-700" />) : (<Phone className="w-5 h-5 text-gray-700" />)}
                    </div>)}
                {/* <div className="bg-gray-100 rounded-full p-3">
                    {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-gray-700" />) : (<Phone className="w-5 h-5 text-gray-700" />)}
                </div> */}

                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        {
                            lastHistory?.status
                        }
                    </h2>
                    <p className="text-sm text-gray-500">
                        {lastHistory?.duration}
                    </p>
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors" onClick={handleCall}>
                Gọi lại
            </button>
        </div>
    </div>) : (<div className="mt-4 flex items-end w-full justify-end">

        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            <div className="flex items-start gap-4 mb-2">
                {(status.current === CallStatus.REJECT || status.current === CallStatus.CANCEL || status.current === CallStatus.TIMEOUT) ?
                    (<div className=" rounded-full p-3" style={{ backgroundColor: 'rgb(243, 66, 95)' }}>
                        {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-white" />) : (<Phone className="w-5 h-5 text-white" />)}
                    </div>) :
                    (<div className="bg-gray-100 rounded-full p-3">
                        {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-gray-700" />) : (<Phone className="w-5 h-5 text-gray-700" />)}
                    </div>)}
                {/* <div className="bg-gray-100 rounded-full p-3">
                    {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-gray-700" />) : (<Phone className="w-5 h-5 text-gray-700" />)}
                </div> */}

                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        {
                            lastHistory?.status
                        }
                    </h2>
                    <p className="text-sm text-gray-500">
                        {lastHistory?.duration}
                    </p>
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors" onClick={handleCall}>
                Gọi lại
            </button>
        </div>
    </div>)) : (username !== message.name ? (<div className="mt-4 flex items-end w-full ">
        <img
            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
            alt="hình ảnh"
            className="rounded-full w-8 h-8 mr-2 align-bottom   "
        />
        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            <div className="flex items-start gap-4 mb-2">
                <div className="bg-gray-100 rounded-full p-3">
                    {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-gray-700" />) : (<Phone className="w-5 h-5 text-gray-700" />)}
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        {
                            lastHistory?.status
                        }
                    </h2>
                    <p className="text-sm text-gray-500">
                        {lastHistory?.duration}
                    </p>
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                Gọi lại
            </button>
        </div>
    </div>) : (<div className="mt-4 flex items-end w-full justify-end">
        <img
            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
            alt="hình ảnh"
            className="rounded-full w-8 h-8 mr-2 align-bottom   "
        />
        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            <div className="flex items-start gap-4 mb-2">
                <div className="bg-gray-100 rounded-full p-3">
                    {history?.callMode === TypeMess.VIDEO_CALL ? (<Camera className="w-5 h-5 text-gray-700" />) : (<Phone className="w-5 h-5 text-gray-700" />)}
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        {
                            lastHistory?.status
                        }
                    </h2>
                    <p className="text-sm text-gray-500">
                        {lastHistory?.duration}
                    </p>
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                Gọi lại
            </button>
        </div>
    </div>))

}
