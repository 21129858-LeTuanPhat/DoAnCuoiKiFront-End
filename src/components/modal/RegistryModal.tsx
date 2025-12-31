import { Button, Modal, Typography, Box } from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketManager from '../../socket/WebSocketManager';
export default function RegistryModal({ openModal }: { openModal: boolean }) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(openModal);
    return (
        <>
            <Modal
                open={open}
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
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: 100, color: 'green', mb: 2 }}
                    />
                    <Typography variant="h6" component="h2" fontWeight={700}>
                        Thành công!
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                        Tài khoản đã được tạo thành công. Vui lòng đi đến trang đăng nhập
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, width: '100%' }}
                        onClick={() => navigate('/login')}
                    >
                        Đi đến trang đăng nhập
                    </Button>
                </Box>
            </Modal>
        </>
    );
}