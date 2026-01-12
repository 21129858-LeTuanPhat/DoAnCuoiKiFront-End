import { Box, Button, Modal, Typography } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { CallStatus } from '../../model/CallProps';
import { resetCall } from '../../redux/callReducer'
import { LocalPhone } from '@mui/icons-material';
import { RootState } from '../../redux/store';
import { TypeMess } from '../../model/ChatMessage';
export default function EndCallModal({ open, onReload }: { open: boolean, onReload?: () => void }) {
    const [openModal, setModal] = useState<boolean>(open)
    const callStore = useSelector((state: RootState) => state.call)
    const dispatch = useDispatch()
    return (
        <div>
            <Modal
                open={openModal}
                disableEscapeKeyDown
            >
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        border: 0,
                        borderRadius: 2,
                        textAlign: 'center',
                    }}
                >
                    {callStore.callMode === TypeMess.VOICE_CALL ? (<LocalPhone
                        sx={{ fontSize: 100, color: 'red', mb: 2 }}
                    />) : (<VideoCameraFrontIcon sx={{ fontSize: 100, color: 'red', mb: 2 }}></VideoCameraFrontIcon>)}
                    <Typography variant="h6" component="h2" fontWeight={700}>
                        Kết thúc!
                    </Typography>
                    <Typography sx={{ mt: 3 }}>
                        Cuộc gọi đã kết thúc
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, width: '100%' }}
                        onClick={() => {
                            setModal(false)
                            dispatch(resetCall())
                            if (onReload) onReload()
                        }}
                    >
                        Thoát
                    </Button>
                </Box>
            </Modal>
        </div >
    )

}
