import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Modal } from '@mui/material';
import { Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { updateStatus } from '../../redux/callReducer';
import { CallStatus } from '../../model/CallProps';
import Call from '../../pages/Call';
import { TypeMess } from '../../model/ChatMessage';

export default function CallModalPage() {
    console.log('dô call modal page nè')
    const [openModal, setModal] = useState<boolean>(true)
    const callStore = useSelector((state: RootState) => state.call)
    const [callKey, setCallKey] = useState(0);
    console.log('call key', callKey)
    useEffect(() => {
        setCallKey(prev => prev + 1);
    }, [callStore.roomID]);
    return (
        <Modal
            open={openModal}

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
                        ...(callStore.callMode === TypeMess.VIDEO_CALL && {
                            width: '1200px',
                        }),
                        position: 'relative',
                    }}
                >
                    <Call key={callKey} setModal={setModal} />
                </Box>
            </Box>
        </Modal >
    );
}