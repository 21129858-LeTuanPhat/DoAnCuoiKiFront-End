import React, { useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { CallStatus, randomRoomID, VIDEO_CONFIG, VOICE_CONFIG } from '../model/CallProps';
import { useQueryParams, NumberParam, StringParam } from 'use-query-params';
import { TypeMess } from '../model/ChatMessage';
export default function Call() {
    const [query, setQuery] = useQueryParams({
        roomID: StringParam,
        call_mode: NumberParam,
    });
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    console.log(query.roomID);
    const [userCount, setUserCount] = useState(0);
    const [callDuration, setCallDuration] = useState(0);
    const callStartTimeRef = useRef<number | null>(null);
    const [isWaiting, setIsWaiting] = useState(true);
    const startTimer = () => {
        if (!callStartTimeRef.current) {
            callStartTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - callStartTimeRef.current!) / 1000);
                setCallDuration(elapsed);
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const roomID = randomRoomID();
    let myMeeting = async (element: any) => {
        const appID = Number(process.env.REACT_APP_ZEGO_APPID);
        const serverSecret = process.env.REACT_APP_ZEGO_SERVER;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret as string,
            query.roomID as string,
            randomRoomID(5),
            localStorage.getItem('username') || 'haha',
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url:
                        window.location.protocol +
                        '//' +
                        window.location.host +
                        window.location.pathname +
                        '?roomID=' +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showPreJoinView: false,
            maxUsers: 2,

            ...(query.call_mode === TypeMess.VOICE_CALL ? VOICE_CONFIG : VIDEO_CONFIG),
            onUserJoin: (users: any[]) => {
                console.log('Users joined:', users);
                const currentUserCount = users.length + 1; // +1 cho chính mình
                setUserCount(currentUserCount);

                if (currentUserCount >= 2) {
                    setIsWaiting(false);
                    startTimer();
                }
            },

            onUserLeave: (users: any[]) => {
                console.log('Users left:', users);
                const currentUserCount = users.length + 1;
                setUserCount(currentUserCount);

                if (currentUserCount < 2) {
                    setIsWaiting(true);
                    stopTimer();
                }
            },

            onJoinRoom: () => {
                console.log('Joined room successfully');
                setUserCount(1);
            },

            onLeaveRoom: () => {
                console.log('Left room');
                stopTimer();
                console.log('Call duration:', callDuration, 'seconds');
            },
            // onUserAvatarSetter: (userList) => {
            //     userList.forEach(user => {
            //         // Bạn có thể set avatar khác nhau cho từng user
            //         if (user && typeof user.setUserAvatar === 'function') {
            //             user.setUserAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHuY484VNuH6DQea0DwgHsAYgZCbR0a-jxmLbciys8zoHjd1JJZut8oRSdcQE0lQnAyckwew&s=10");
            //         }
            //     });
            // },
        });
    };
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
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
                ref={myMeeting as any}
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
