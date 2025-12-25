import { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { ref, set, onValue } from 'firebase/database';

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

async function sendChatInvitation(me: string | null, target: string) {
    try {
        const sentRef = ref(db, `sent_requests/people/${me}/${target}`);
        const invRef = ref(db, `invitations/people/${target}/${me}`);

        await set(sentRef, {
            status: 'pending',
            createdAt: Date.now(),
        });

        await set(invRef, {
            status: 'pending',
            createdAt: Date.now(),
        });

        return true;
    } catch (error) {
        console.error('Send invitation failed:', error);
        return false;
    }
}

async function changeStatusConnectChat(status: ChatConnectState, me: string | null, target: string) {
    const key = [me, target].sort().join('_');
    const connect = ref(db, `connections/people/${key}`);

    const invRef = ref(db, `invitations/people/${me}/${target}`);
    const sentRef = ref(db, `sent_requests/people/${target}/${me}`);
    if (status == 'connected') {
        await set(connect, true);
    }
    await set(invRef, {
        status: status,
        createdAt: Date.now(),
    });
    await set(sentRef, {
        status: status,
        createdAt: Date.now(),
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
