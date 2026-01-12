import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { Phone } from 'lucide-react';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { CallInterface, CallStatus, randomRoomID } from '../../model/CallProps';
import WebSocketManager from '../../socket/WebSocketManager';
import { useBoardContext } from '../../hooks/useBoardContext';
import nokiaSound from '../../assets/sound/instagram_call.mp3';
import { ChatMessage, TypeMess } from '../../model/ChatMessage';
import { incomingCall, outgoingCall, ReducerCall, updateStatus } from '../../redux/callReducer'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
export default function CallModal({
    open,
    setOpen,
    typeCall,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    typeCall: number;
}) {

    const { type } = useBoardContext();
    const callStore = useSelector((state: RootState) => state.call)
    const dispatch = useDispatch()
    const refSendMess = useRef<ReducerCall>({
        callStatus: CallStatus.IDLE,
        isIncoming: false,
        caller: null,
        type: undefined,
        callMode: undefined,
        roomID: undefined,
        roomURL: undefined,
    })
    useEffect(() => {
        refSendMess.current = callStore
    }, [callStore])
    const sendEnd = () => {
        console.log('gửi kết thúc cuộc gọi nè')
        const ws = WebSocketManager.getInstance();
        const callMess = {
            status: CallStatus.CANCEL,
            roomURL: `/call?roomID=${refSendMess.current.roomID}&call_mode=${refSendMess.current.callMode}`,
            roomID: refSendMess.current.roomID,
        };
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: encodeURIComponent(JSON.stringify({ type: refSendMess.current.callMode, data: callMess })),
                    },
                },
            }),
        );
    }
    const sendTimeout = () => {
        console.log('gửi timeout nè')
        const ws = WebSocketManager.getInstance();
        const timeout = {
            status: CallStatus.TIMEOUT,
            roomURL: `/call?roomID=${refSendMess.current.roomID}&call_mode=${refSendMess.current.callMode}`,
            roomID: refSendMess.current.roomID,
        };

        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: encodeURIComponent(JSON.stringify({ type: refSendMess.current.callMode, data: timeout })),
                    },
                },
            }),
        );
    }
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                sendTimeout()
                dispatch(updateStatus({ status: CallStatus.TIMEOUT }))
                setOpen(false)
            }, 45000)
            return () => clearTimeout(timer)
        }
    }, [open])
    // const openModal = useState<boolean>(open)
    useEffect(() => {
        if (callStore.callStatus === CallStatus.IN_CALL) {
            setOpen(false)
        }
    }, [callStore.callStatus])
    const roomID = randomRoomID();
    const { selectedUser } = useBoardContext();
    const username = localStorage.getItem('username');
    console.log('room id:', roomID, ' name', username, 'selected user', selectedUser, ' type: ', type);
    const callMess = {
        status: CallStatus.CALLING,
        roomURL: `/call?roomID=${roomID}&call_mode=${typeCall}`,
        roomID: roomID,
    };
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        audioRef.current = new Audio(nokiaSound);
        audioRef.current.volume = 0.7;
        audioRef.current.loop = true;
        audioRef.current.play();
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);


    const sendMessage = () => {
        const ws = WebSocketManager.getInstance();
        dispatch(outgoingCall({ roomID: roomID, caller: selectedUser, callMode: typeCall, roomURL: callMess.roomURL, type: type }))
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: encodeURIComponent(JSON.stringify({ type: typeCall, data: callMess })),
                    },
                },
            }),
        );
    };


    useEffect(() => {
        if (open) {
            sendMessage()
        }
    }, [open])

    // useEffect(() => {

    // }, [open])
    const handleClose = () => {
        sendEnd()
        dispatch(updateStatus({ status: CallStatus.CANCEL }));
        setOpen(false);
    };

    //className='min-h-screen bg-black flex flex-col items-center justify-between p-8'

    return (
        <>
            <Modal open={open} disableEscapeKeyDown>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        height: 500,
                        bgcolor: 'background.paper',
                        // background: 'linear-gradient(to right, #9333ea, #ec4899)',
                        boxShadow: 24,
                        borderRadius: 2,
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '40px',
                    }}
                >
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">

                            </div>
                            <h1 className="text-gray-900 text-2xl font-semibold mb-2">{type}</h1>
                            <p className="text-gray-500 text-sm">Đang gọi...</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={handleClose}
                            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                        >
                            <Phone className="w-6 h-6 text-white transform rotate-135" />
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}
