import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { CallStatus, randomRoomID, VIDEO_CONFIG, VOICE_CONFIG } from '../model/CallProps';
import { useQueryParams, NumberParam, StringParam } from 'use-query-params';
import { TypeMess } from '../model/ChatMessage';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../redux/store';
import { callbackify } from 'util';
import WebSocketManager from '../socket/WebSocketManager';
import { useBoardContext } from '../hooks/useBoardContext';
import { updateStatus } from '../redux/callReducer';

export default function Call({ setModal }: { setModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    console.log('dô call nè')

    const callStore = useSelector((state: RootState) => state.call)
    const zpRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const userLeftFirstRef = useRef(false);
    const hasJoinedRef = useRef(false);
    const hasLeftRoomRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [userCount, setUserCount] = useState(0);
    const userCountRef = useRef(0); // Ref to track user count for closure access
    const refDuration = useRef<number>(0)
    const [callDuration, setCallDuration] = useState(0);
    const callStartTimeRef = useRef<number | null>(null);
    const [isWaiting, setIsWaiting] = useState(true);
    // console.log('call Duration nè', callDuration)
    // console.log('số user hiện tại:', userCount)
    useEffect(() => {

        refDuration.current = callDuration
    }, [callDuration])
    const dispatch = useDispatch();
    // console.log('ref duration nè', refDuration)

    const startTimer = () => {
        if (!callStartTimeRef.current) {
            callStartTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - callStartTimeRef.current!) / 1000);
                setCallDuration(elapsed);
                refDuration.current = elapsed;
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        callStartTimeRef.current = null;
    };

    const sendEnd = () => {
        console.log('gửi kết thúc cuộc gọi nè');
        const ws = WebSocketManager.getInstance();

        // Thêm field 'from' nếu là room call
        const callMess = callStore.type === 'room' ? {
            status: CallStatus.ENDED,
            roomURL: `/call?roomID=${callStore.roomID}&call_mode=${callStore.callMode}`,
            roomID: callStore.roomID,
            duration: refDuration.current,
            from: callStore.caller, // Người gọi ban đầu
        } : {
            status: CallStatus.ENDED,
            roomURL: `/call?roomID=${callStore.roomID}&call_mode=${callStore.callMode}`,
            roomID: callStore.roomID,
            duration: refDuration.current,
        };

        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: callStore.type,
                        to: callStore.caller,
                        mes: encodeURIComponent(JSON.stringify({ type: callStore.callMode, data: callMess })),
                    },
                },
            }),
        );
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!containerRef.current || hasJoinedRef.current) return;

        hasJoinedRef.current = true;

        const initCall = async () => {
            try {
                const appID = Number(process.env.REACT_APP_ZEGO_APPID);
                const serverSecret = process.env.REACT_APP_ZEGO_SERVER;
                const roomID = randomRoomID();

                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret as string,
                    callStore.roomID as string,
                    randomRoomID(5),
                    localStorage.getItem('username') || 'haha',
                );
                if ((window as any).zegoCurrentInstance) {
                    console.log('Found zombie Zego instance, destroying...');
                    try {
                        (window as any).zegoCurrentInstance.destroy();
                    } catch (err) {
                        console.error('Error destroying zombie instance:', err);
                    }
                    (window as any).zegoCurrentInstance = null;
                }

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zpRef.current = zp;
                (window as any).zegoCurrentInstance = zp; // Save to global

                await zp.joinRoom({
                    container: containerRef.current,
                    sharedLinks: [
                        {
                            name: 'Personal link',
                            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },
                    showPreJoinView: false,
                    ...(callStore.type === 'people' && { maxUsers: 2 }),
                    // maxUsers: 2,
                    ...(callStore.callMode === TypeMess.VOICE_CALL ? VOICE_CONFIG : VIDEO_CONFIG),
                    onUserJoin: (users: any[]) => {
                        console.log('Users joined:', users);
                        // Update ref properly
                        userCountRef.current += users.length;
                        const currentUserCount = userCountRef.current;
                        setUserCount(currentUserCount);

                        if (currentUserCount >= 2) {
                            setIsWaiting(false);
                            startTimer();
                        }
                    },

                    onUserLeave: (users: any[]) => {
                        console.log('Users left:', users);
                        // Update ref properly
                        userCountRef.current = Math.max(0, userCountRef.current - users.length);
                        const currentUserCount = userCountRef.current;
                        console.log('current user count:', currentUserCount);
                        setUserCount(currentUserCount);

                        if (currentUserCount < 2 && !userLeftFirstRef.current) {
                            userLeftFirstRef.current = true;
                            setIsWaiting(true);
                            stopTimer();

                            // Lazy Cleanup Strategy: Just HangUp and Close
                            setTimeout(() => {
                                hasLeftRoomRef.current = true;
                                if (zpRef.current && typeof zpRef.current.hangUp === 'function') {
                                    zpRef.current.hangUp();
                                }
                                setModal(false);
                            }, 500);
                        }
                    },
                    onJoinRoom: () => {
                        // console.log('Joined room successfully');
                        // Reset count to 1 (self) when joining
                        setUserCount(1);
                        userCountRef.current = 1;
                        userLeftFirstRef.current = false;
                    },

                    onLeaveRoom: () => {
                        hasLeftRoomRef.current = true;
                        console.log('userLeftFirstRef:', userLeftFirstRef.current);
                        stopTimer();

                        // Lazy Cleanup Strategy: Just HangUp and Close
                        setTimeout(() => {
                            if (zpRef.current && typeof zpRef.current.hangUp === 'function') {
                                zpRef.current.hangUp();
                            }
                            setModal(false);
                        }, 300);

                        // Phân biệt logic theo type
                        if (callStore.type === 'room') {
                            // ROOM CALL: Chỉ gửi ENDED khi còn <= 2 người
                            const currentCount = userCountRef.current;
                            console.log('Room call ending. User count:', currentCount);

                            if (currentCount <= 2 && !userLeftFirstRef.current) {
                                // Còn 2 người (mình + 1 người khác), mình rời → Gửi ENDED
                                sendEnd();
                                console.log('Room còn <= 2 người, gửi ENDED');
                            } else if (currentCount > 2) {
                                // Còn > 2 người → Không gửi ENDED
                                console.log('Room còn', currentCount, 'người, KHÔNG gửi ENDED');
                            } else {
                                console.log('Room: Người bị động, không gửi ENDED');
                            }
                        } else {
                            // PEOPLE CALL: Logic cũ (luôn gửi ENDED nếu là người chủ động rời)
                            if (!userLeftFirstRef.current) {
                                sendEnd();
                                console.log('People call: Gửi ENDED');
                            } else {
                                console.log('People call: Người bị động, không gửi');
                            }
                        }

                        console.log('Call duration:', callDuration, 'seconds');
                        userLeftFirstRef.current = false;
                        dispatch(updateStatus({ status: CallStatus.ENDED }));
                    },

                });
            } catch (error) {
                console.error('Error joining room:', error);
                setModal(false);
            }
        };

        initCall();
        return () => {
            console.log('Cleanup call component');
            stopTimer();

            if (zpRef.current) {
                try {
                    // Gọi hangUp trước để đóng connection đúng cách
                    if (!hasLeftRoomRef.current && typeof zpRef.current.hangUp === 'function') {
                        zpRef.current.hangUp();
                    }
                } catch (error) {
                    console.error('Error hanging up:', error);
                }

                // NO DESTROY HERE - Leave it for next init
                zpRef.current = null;
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                }
            }

            hasJoinedRef.current = false;
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '90vh' }}>
            {isWaiting && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            border: '5px solid #f3f3f3',
                            borderTop: '5px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                    <p style={{ marginTop: '20px', fontSize: '18px' }}>
                        LOADING
                    </p>
                </div>
            )}
            {!isWaiting && callDuration > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        zIndex: 999,
                        fontSize: '10px',
                        fontWeight: 'bold',
                    }}
                >
                    {formatTime(callDuration)}
                </div>
            )}
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%' }}
            />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}