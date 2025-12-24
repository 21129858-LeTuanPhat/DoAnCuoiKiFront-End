import { Box, CircularProgress, Modal, Typography } from '@mui/material'
import { Phone } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { CallStatus, randomRoomID } from '../../model/CallProps'
import { REACT_BASE_URL } from '../../config/utils'
import WebSocketManager from '../../socket/WebSocketManager'
import { useBoardContext } from '../../hooks/useBoardContext'
import nokiaSound from "../../assets/sound/instagram_call.mp3";
export default function CallModal({ open, setOpen, typeCall }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, typeCall: string }) {
    const roomID = randomRoomID()
    const { type, selectedUser } = useBoardContext();
    const username = localStorage.getItem('username')
    console.log('room id:', roomID, ' name', username, 'selected user', selectedUser, ' type: ', type)
    const callMess = {
        callMode: typeCall,
        status: CallStatus.CALLING,
        roomURL: `${REACT_BASE_URL}/call?roomID=${roomID}`
    }
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        audioRef.current = new Audio(nokiaSound);
        audioRef.current.volume = 0.7;
        audioRef.current.loop = true;
        audioRef.current.play()

        return () => {
            // cleanup khi component unmount
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    const sendMessage = () => {
        const ws = WebSocketManager.getInstance();
        ws.onMessage('SEND_CHAT', (msg) => {
            if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
                ws.unSubcribe('SEND_CHAT');
            }
        });
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: type,
                        to: selectedUser,
                        mes: JSON.stringify(callMess)
                    },
                },
            }),
        );
    }

    // useEffect(() => {

    //     audio.volume = 0.5;
    //     // audio.loop = true;
    //     audio.play().catch((e) => { console.log('catch sound', e.message) });
    // }, [])
    if (open) {

        sendMessage()
    }

    // useEffect(() => {

    // }, [open])
    const handleClose = () => {

        setOpen(false)
    }


    //className='min-h-screen bg-black flex flex-col items-center justify-between p-8'
    return (
        <>
            <Modal
                open={open}
                disableEscapeKeyDown
            >
                <Box sx={{
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
                }}>
                    {/* Nội dung chính */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                {/* Có thể thêm avatar hoặc icon ở đây */}
                            </div>
                            <h1 className="text-gray-900 text-2xl font-semibold mb-2">
                                {type}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Đang gọi...
                            </p>
                        </div>
                    </div>
                    {/* Nút hành động */}
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
    )
}
