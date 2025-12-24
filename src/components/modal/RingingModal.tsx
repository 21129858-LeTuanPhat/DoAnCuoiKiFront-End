import { Phone } from '@mui/icons-material'
import { Avatar, Box, Button, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef } from 'react'
import { deepOrange } from '@mui/material/colors';
import nokiaSound from '../../assets/sound/nokia_ringirng.mp3'

export default function RingingModal({ open }: { open: boolean }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        audioRef.current = new Audio(nokiaSound)
        audioRef.current.volume = 0.7
        audioRef.current.play()
        audioRef.current.loop = true
        return () => {
            audioRef.current?.pause()
        }
    }, [])
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
                        <Typography fontWeight={700} fontSize={20} paddingTop={3} >Tài Phạm</Typography>
                        <Typography fontSize={15} marginBottom={3} >đang gọi cho bạn</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mt: 3, borderRadius: '50%', minWidth: 0, width: 50, height: 50 }}

                            >
                                <Phone sx={{ fontSize: 25 }}></Phone>

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

