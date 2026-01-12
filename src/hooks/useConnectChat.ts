import { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { ref, set, onValue, get } from 'firebase/database';
import { Web } from '@mui/icons-material';
import WebSocketManager from '../socket/WebSocketManager';

type ChatConnectState = 'none' | 'pending' | 'incoming' | 'connected' | 'cancel';

function parseChatConnectState(state: ChatConnectState): string {
    switch (state) {
        case 'none':
            return 'Kết bạn';
        case 'pending':
            return 'Đã gửi lời mời';
        case 'incoming':
            return 'Chấp nhận';
        case 'connected':
            return 'Nhắn tin';
        case 'cancel':
            return 'Bị từ chối';
    }
}

function useChatConnect(me: string | null, target?: string | null): ChatConnectState {
    const [state, setState] = useState<ChatConnectState>('none');
    const webSocket = WebSocketManager.getInstance();

    useEffect(() => {
        if (!target) {
            setState('none');
            return;
        }

        const key = [me, target].sort().join('_');

        const connRef = ref(db, `connections/people/${key}`);
        const invRef = ref(db, `invitations/people/${me}/${target}`);
        const sentRef = ref(db, `sent_requests/people/${me}/${target}`);

        const unsubConn = onValue(connRef, (snap) => {
            if (snap.exists()) {
                setState('connected');
            }
        });

        const unsubInv = onValue(invRef, (snap) => {
            const val = snap.val();
            if (val?.status === 'pending') {
                setState('incoming');
            }
        });

        const unsubSent = onValue(sentRef, (snap) => {
            const val = snap.val();
            if (val?.status === 'pending') {
                setState('pending');
            }
        });

        return () => {
            unsubConn();
            unsubInv();
            unsubSent();
        };
    }, [me, target]);

    return state;
}

async function sendChatInvitation(webSocket: WebSocketManager, me: string | null, target: string) {
    try {
        const sentRef = ref(db, `sent_requests/people/${me}/${target}`);
        const invRef = ref(db, `invitations/people/${target}/${me}`);
        const imageUrl = await get(ref(db, `users/${me}/profile/imageUrl`));

        console.log('Sending chat invitation from', me, 'to', target);

        await set(sentRef, {
            status: 'pending',
            createdAt: Date.now(),
            imageUrl: imageUrl.exists() ? imageUrl.val() : '',
        });

        await set(invRef, {
            status: 'pending',
            createdAt: Date.now(),
            imageUrl: imageUrl.exists() ? imageUrl.val() : '',
        });

        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'people',
                        to: target,
                        mes: encodeURIComponent(
                            JSON.stringify({
                                type: -1,
                                data: `${me} đã gửi lời mời kết bạn.`,
                            }),
                        ),
                    },
                },
            }),
        );

        return true;
    } catch (error) {
        console.error('Send invitation failed:', error);
        return false;
    }
}

async function changeStatusConnectChat(
    webSocket: WebSocketManager,
    status: ChatConnectState,
    me: string | null,
    target: string,
) {
    const key = [me, target].sort().join('_');
    const connect = ref(db, `connections/people/${key}`);

    const imageUrl = await get(ref(db, `users/${target}/profile/imageUrl`));
    const invRef = ref(db, `invitations/people/${me}/${target}`);
    const sentRef = ref(db, `sent_requests/people/${target}/${me}`);
    if (status == 'connected') {
        await set(connect, true);
        webSocket.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'SEND_CHAT',
                    data: {
                        type: 'people',
                        to: target,
                        mes: encodeURIComponent(
                            JSON.stringify({
                                type: -1,
                                data: `${me} đã chấp nhận lời mời kết bạn.`,
                            }),
                        ),
                    },
                },
            }),
        );
    }
    await set(invRef, {
        status: status,
        createdAt: Date.now(),
        imageUrl: imageUrl.exists() ? imageUrl.val() : '',
    });
    await set(sentRef, {
        status: status,
        createdAt: Date.now(),
        imageUrl: imageUrl.exists() ? imageUrl.val() : '',
    });
}

export { parseChatConnectState, useChatConnect, sendChatInvitation, changeStatusConnectChat };

// {

//   "invitations": {
//     "people": {
//       "ti": {
//         "long": {
//           "status": "pending",
//           "createdAt": 170000001
//         }
//       },

//   },

//   "sent_requests": {
//     "people": {
//       "long": {
//         "ti": {
//           "status": "pending",
//           "createdAt": 170000001
//         }
//       }
//     }
//   },

//   "connections": {
//     "people": {
//       "long_ti": true
//     }
//   }
// }
