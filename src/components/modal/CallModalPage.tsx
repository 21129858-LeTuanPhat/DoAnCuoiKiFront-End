import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Modal } from '@mui/material';
import { Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { updateStatus } from '../../redux/callReducer';
import { CallStatus } from '../../model/CallProps';
import Call from '../../pages/Call';
// Import component Call hiện tại của bạn

export default function CallModalPage() {
    // const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const [searchParams] = useSearchParams();
    // const selection = useSelector((state: RootState) => state.call);

    // const roomID = searchParams.get('roomID') || selection.roomID;
    // const callMode = searchParams.get('call_mode') || selection.callMode;

    return (
        <Modal
            open={true}

            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            disableEscapeKeyDown
        >
            <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >

                <Box
                    sx={{
                        flex: 1,
                        background: '#000',
                        // width: '1200px',
                        position: 'relative',
                    }}
                >
                    <Call />
                </Box>
            </Box>
        </Modal>
    );
}