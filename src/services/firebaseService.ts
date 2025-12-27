import { db } from './../config/firebaseConfig';
import { ref, set, get } from 'firebase/database';
import ProfileForm from '../model/ProfileForm';
import RequestConnect, { ResponseStatus } from '../model/RequestConnect';
import { create } from 'domain';

async function handleChangeProfile({ profileData }: { profileData: ProfileForm }) {
    const key = `profiles/${profileData.username}`;

    let profileRef = ref(db, key);

    await set(profileRef, {
        username: profileData.username,
        fullName: profileData.fullName,
        address: profileData.address,
        introduce: profileData.introduce,
        imageUrl: profileData.imageUrl,
    });
}

async function getUserProfile(username: string): Promise<ProfileForm | null> {
    const key = `profiles/${username}`;

    const profileRef = ref(db, key);
    const snapshot = await get(profileRef);
    console.log('snapshot value', snapshot.val());

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as ProfileForm;
}

async function getInvitation(
    username: string,
    type: 'people' | 'room',
    category: 'invitations' | 'sent_requests' = 'invitations',
): Promise<RequestConnect[]> {
    const key = `${category}/${type}/${username}`;
    const invitationRef = ref(db, key);
    const snapshot = await get(invitationRef);
    console.log('snapshot value', snapshot.val());
    if (!snapshot.exists()) {
        return [];
    }
    const data = snapshot.val();
    const listConnect = Object.entries(data).map(([key, value]: [string, any]) => {
        return {
            username: key,
            imageUrl: value.imageUrl,
            createAt: value.createdAt,
            status: value.status,
            type: type,
        };
    });

    return listConnect as RequestConnect[];
}

async function createGroup({
    name,
    description,
    imageUrl,
    adminUsername,
    members,
}: {
    name: string;
    description?: string;
    imageUrl?: string;
    adminUsername: string;
    members: string[];
}) {
    const groupRef = `groups/${name}`;
    await set(ref(db, groupRef), {
        name,
        description: description || '',
        imageUrl: imageUrl || '',
        adminUsername,
        createAt: Date.now(),
    });
    const memberRef = `group_members/${name}`;

    await set(ref(db, memberRef + '/' + adminUsername), {
        role: 'admin',
        joinAt: Date.now(),
    });

    for (const member of members) {
        await set(ref(db, `sent_requests/room/${name}/${member}`), {
            status: 'pending',
            createdAt: Date.now(),
            imageUrl: imageUrl || '',
        });

        await set(ref(db, `invitations/room/${member}/${name}`), {
            status: 'pending',
            createdAt: Date.now(),
            imageUrl: imageUrl || '',
        });
    }
}

async function changeStatusRoomResponse({
    type,
    request,
    status,
    username,
}: {
    type: string;
    request: RequestConnect;
    status: ResponseStatus;
    username: string;
}) {
    const key = `invitations/${request.type}/${username}/${request.username}`;
    await set(ref(db, key), {
        status: status,
        createdAt: request.createAt,
        imageUrl: request.imageUrl,
    });

    const sentKey = `sent_requests/${request.type}/${request.username}/${username}`;
    await set(ref(db, sentKey), {
        status: status,
        createdAt: request.createAt,
        imageUrl: request.imageUrl,
    });
    console.log('STATUS', status);
    if (status !== 'connected') return;

    if (type === 'people') {
        const key = [username, request.username].sort().join('_');
        const connRef = ref(db, `connections/people/${key}`);
        await set(connRef, true);
    } else if (type === 'room') {
        const memberRef = `group_members/${request.username}/${username}`;
        await set(ref(db, memberRef), {
            role: 'member',
            joinAt: Date.now(),
        });
    }
}

export { handleChangeProfile, getUserProfile, getInvitation, createGroup, changeStatusRoomResponse };
