import { Phone, VideoCall } from '@mui/icons-material'
import { Avatar, Box, Button, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { deepOrange } from '@mui/material/colors';
import nokiaSound from '../../assets/sound/mew_meo.mp3'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CallStatus } from '../../model/CallProps';
import { sendSignal } from '../../socket/CallWS';
import WebSocketManager from '../../socket/WebSocketManager';
import { TypeMess } from '../../model/ChatMessage';
import { useBoardContext } from '../../hooks/useBoardContext';
import { updateStatus, resetCall } from '../../redux/callReducer'
import { CallContext } from '../../pages/ChatAppPage';

export default function RingingModal({ open, onReload }: { open: boolean, onReload?: () => void }) {
    const [openModal, setModal] = useState<boolean>(open)
    const { type } = useBoardContext();
    const dispatch = useDispatch()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const callStore = useSelector((state: RootState) => state.call)
    console.log('type trong ringing nè', type)
    const selection = useSelector((state: RootState) => state.call)
    const context = useContext(CallContext)
    console.log('context trong ring ring', context?.refStatusIncall)

    useEffect(() => {
        audioRef.current = new Audio(nokiaSound)
        audioRef.current.volume = 0.7
        audioRef.current.play()
        audioRef.current.loop = true
        return () => {
            audioRef.current?.pause()
        }
    }, [])

    // Thêm field 'from' nếu là room call
    const username = localStorage.getItem('username');
    const callMess = callStore.type === 'room' ? {
        status: CallStatus.CONNECTING,
        roomURL: `/call?roomID=${selection.roomID}&call_mode=${selection.callMode}`,
        roomID: selection.roomID,
        from: callStore.caller, // Người gọi ban đầu (KHÔNG phải người accept)
    } : {
        status: CallStatus.CONNECTING,
        roomURL: `/call?roomID=${selection.roomID}&call_mode=${selection.callMode}`,
        roomID: selection.roomID,
    };

    useEffect(() => {
        if (callStore.callStatus === CallStatus.TIMEOUT) {
            setModal(false)
        }
    }, [callStore.callStatus])
    const messReject = {
        status: CallStatus.REJECT,
        roomURL: `/call?roomID=${selection.roomID}&call_mode=${selection.callMode}`,
        roomID: selection.roomID,
    };


    const sendMessAccept = () => {
        const ws = WebSocketManager.getInstance();
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: callStore.type,
                        to: callStore.caller,
                        mes: encodeURIComponent(JSON.stringify({ type: selection.callMode, data: callMess }))
                    },
                },
            }),
        );
        console.log('send mess trong ring ring modal', JSON.stringify({
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: callStore.type,
                    to: callStore.caller,
                    mes: (JSON.stringify({ type: selection.callMode, data: callMess }))
                },
            },
        }),)
    }
    const handleAccept = () => {
        if (!context) return;
        console.log('nhấn accept')
        // dispatch(inCall())
        // else {
        if (!context.refStatusIncall.current) {
            dispatch(updateStatus({ status: CallStatus.CONNECTING }))
            console.error('chuyển sendMessAccept')
            sendMessAccept()
            return
        }
        else {
            console.error('nhấn accept nhưng refStatusIncall = true ')
            dispatch(updateStatus({ status: CallStatus.IN_CALL }))
        }
    }
    const handleClose = () => {
        const ws = WebSocketManager.getInstance();
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: callStore.type,
                        to: selection.caller,
                        mes: encodeURIComponent(JSON.stringify({ type: selection.callMode, data: messReject })),
                    },
                },
            }),
        );

        dispatch(resetCall())
        if (context) context.refStatusIncall.current = false;
        if (onReload) onReload()
        setModal(false)
    }

    return (
        <div>
            <Modal open={openModal}>
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        py: 3,
                        border: 0,
                        minWidth: 0,

                        borderRadius: 2,
                        textAlign: 'center',
                    }} >
                    <Box sx={{
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h6" component="h2" fontWeight={700} paddingBottom={3}>
                            Cuộc gọi đến                    </Typography>
                        <Avatar sx={{ bgcolor: deepOrange[500], width: 70, height: 70 }}>Oke</Avatar>
                        <Typography fontWeight={700} fontSize={20} paddingTop={3} >{callStore.caller}</Typography>
                        <Typography fontSize={15} marginBottom={3} >đang gọi cho bạn</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                            <Button onClick={handleAccept}
                                variant="contained"
                                color="success"
                                sx={{ mt: 3, borderRadius: '50%', minWidth: 0, width: 50, height: 50 }}
                            >
                                {callStore.callMode === TypeMess.VOICE_CALL ? (<Phone sx={{ fontSize: 25 }} ></Phone>
                                ) : (<VideoCall sx={{ fontSize: 25 }} ></VideoCall>)}
                            </Button>
                            <Button variant="contained" color='error' onClick={handleClose}
                                sx={{ mt: 3, borderRadius: '50%', minWidth: 0, width: 50, height: 50 }}>
                                <CloseIcon sx={{ fontSize: 25 }}></CloseIcon>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

