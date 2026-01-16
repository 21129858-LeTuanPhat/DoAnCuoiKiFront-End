import { Box, Button, Modal, Typography } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CallStatus } from '../../model/CallProps';
import { resetCall } from '../../redux/callReducer'
import { RootState } from '../../redux/store';
export default function TimeOutModal({ open, onReload }: { open: boolean, onReload?: () => void }) {
    const [openModal, setModal] = useState(open)
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
                    <HighlightOffIcon
                        sx={{ fontSize: 100, color: 'red', mb: 2 }}
                    />
                    <Typography variant="h6" component="h2" fontWeight={700}>
                        Kết thúc!
                    </Typography>
                    <Typography sx={{ mt: 3 }}>
                        {callStore.isIncoming ? `Bạn đã bỏ lỡ cuộc gọi từ ${callStore.caller}` : `Không bắt máy. Vui lòng gọi lại sau`}
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
        </div>
    )
}
