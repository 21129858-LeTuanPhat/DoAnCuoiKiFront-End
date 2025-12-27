import { Phone, VideoCall } from '@mui/icons-material'
import { Avatar, Box, Button, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef } from 'react'
import { deepOrange } from '@mui/material/colors';
import nokiaSound from '../../assets/sound/nokia_ringirng.mp3'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CallStatus, ICallMode } from '../../model/CallProps';
import { REACT_BASE_URL } from '../../config/utils';
import { inCall } from '../../redux/callReducer'
import { sendSignal } from '../../socket/CallWS';

export default function RingingModal({ open }: { open: boolean }) {
    const dispatch = useDispatch()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const callStore = useSelector((state: RootState) => state.call)
    const paddingTop = 50;
    const paddingLeft = 100;
    const width = window.innerWidth - paddingLeft * 2;
    const height = window.innerHeight - paddingTop * 2;
    useEffect(() => {
        // audioRef.current = new Audio(nokiaSound)
        // audioRef.current.volume = 0.7
        // audioRef.current.play()
        // audioRef.current.loop = true
        // return () => {
        //     audioRef.current?.pause()
        // }
    }, [])
    const handleAccept = () => {
        dispatch(inCall())
        window.open(
            `${callStore.roomURL}`,
            "_blank",
            `width=${width},height=${height},left=${paddingLeft},top=${paddingTop}`
        );
        sendSignal(callStore.caller as string, { type: callStore.callMode as string, roomID: callStore.roomID as string, status: CallStatus.ACCEPTED })
    }
    return (
        <div>
            <Modal open={open}>
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
                                {callStore.callMode === ICallMode.VOICE ? (<Phone sx={{ fontSize: 25 }} ></Phone>
                                ) : (<VideoCall sx={{ fontSize: 25 }} ></VideoCall>)}
                            </Button>
                            <Button variant="contained" color='error'
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

