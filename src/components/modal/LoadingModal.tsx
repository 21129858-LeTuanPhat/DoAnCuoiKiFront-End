import { Box, CircularProgress, Modal, Typography } from '@mui/material'
import React from 'react'

export default function LoadingModal({ open }: { open: boolean }) {
    return (
        <Modal open={open} disableEscapeKeyDown>
            <Box
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    padding: '40px 0',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    py: 7,
                    border: 0,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <CircularProgress />
                <Typography variant="h6" component="h2" fontWeight={700} marginTop={2} sx={{
                    '&::after': {
                        content: '"..."',
                        animation: 'dots 1.5s steps(3, end) infinite',
                    },
                    // '@keyframes dots': {
                    //     '0%': { content: '"."' },
                    //     '33%': { content: '".."' },
                    //     '66%': { content: '"..."' },
                    // },
                }}>
                    Vui lòng chờ
                </Typography>
            </Box>
        </Modal>
    )
}
