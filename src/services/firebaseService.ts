import { db } from './../config/firebaseConfig';
import { ref, set, get, query, orderByChild, endBefore, limitToLast, onChildAdded } from 'firebase/database';
import ProfileForm from '../model/ProfileForm';
import RequestConnect, { ResponseStatus } from '../model/RequestConnect';
import { create } from 'domain';
import InforGroup from '../model/InforGroup';

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
    console.log('GET USER PROFILE', username);
    const key = `profiles/${username}`;

    const profileRef = ref(db, key);
    const snapshot = await get(profileRef);
    console.log('snapshot value', snapshot.val());

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as ProfileForm;
}

async function getAllProfile(): Promise<ProfileForm[] | null> {
    console.log('GET All PROFILE');
    const key = `profiles`;

    const profileRef = ref(db, key);
    const snapshot = await get(profileRef);
    console.log('snapshot value', snapshot.val());

    if (!snapshot.exists()) {
        return null;
    }

    return Object.keys(snapshot.val()).map<ProfileForm>((key) => snapshot.val()[key]);
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

async function getInforGroup(groupName: string): Promise<InforGroup | null> {
    const InforGroupRef = ref(db, `groups/${groupName}`);
    const snapshot = await get(InforGroupRef);
    if (!snapshot.exists()) {
        return null;
    }
    const menbersCountRef = ref(db, `group_members/${groupName}`);
    const menbersSnapshot = await get(menbersCountRef);
    const menbersCount = menbersSnapshot.exists() ? Object.keys(menbersSnapshot.val()).length : 0;

    const inforGroup = {
        ...snapshot.val(),
        imageUrl: snapshot.val().imageUrl === '' ? null : snapshot.val().imageUrl,
        menbersCount: menbersCount,
    };
    return inforGroup as InforGroup;
}

async function getAllInforGroup(): Promise<InforGroup[] | null> {
    console.log('GET All INFOR GROUP');
    const InforGroupRef = ref(db, `groups`);
    const snapshot = await get(InforGroupRef);
    if (!snapshot.exists()) {
        return null;
    }

    const groupsData = snapshot.val();
    console.log('groupsData:', groupsData);
    const inforGroups: InforGroup[] = [];

    for (const groupName in groupsData) {
        const menbersCountRef = ref(db, `group_members/${groupName}`);
        const menbersSnapshot = await get(menbersCountRef);

        const menbersCount = menbersSnapshot.exists() ? Object.keys(menbersSnapshot.val()).length : 0;

        const inforGroup = {
            ...snapshot.child(groupName).val(),
            imageUrl: snapshot.child(groupName).val().imageUrl === '' ? null : snapshot.child(groupName).val().imageUrl,
            menbersCount: menbersCount,
        };
        inforGroups.push(inforGroup as InforGroup);
    }

    return inforGroups;
}

async function createStory({
    imageUrl,
    content,
    username,
}: {
    imageUrl: string | null | undefined;
    content: string;
    username: string;
}) {
    const key = `${username}_${Date.now()}`;
    await set(ref(db, `stories/${key}`), {
        id: key,
        ownerUsername: username,
        imageUrl: imageUrl || '',
        content,
        createAt: Date.now(),
        expireAt: Date.now() + 24 * 60 * 60 * 1000,
        like: 0,
        view: 0,
    });

    const connectionsRef = ref(db, `connections/people/`);
    const connSnapshot = await get(connectionsRef);
    if (!connSnapshot.exists()) {
        return;
    }

    const connData = connSnapshot.val();

    const feedRef = `story_feed/${username}/${key}`;
    await set(ref(db, feedRef), {
        storyId: key,
        fromUsername: username,
        createAt: Date.now(),
    });
    Object.keys(connData).forEach(async (data) => {
        const members = data.split('_');
        if (members.includes(username)) {
            const friendName = members[0] === username ? members[1] : members[0];
            if (friendName) {
                const feedRef = `story_feed/${friendName}/${key}`;
                await set(ref(db, feedRef), {
                    storyId: key,
                    fromUsername: username,
                    createAt: Date.now(),
                });
            }
        }
    });
}
function LoadStoryFeed(username: string, callback: (storyId: string) => void) {
    const q = query(ref(db, `story_feed/${username}`), orderByChild('createAt'));

    return onChildAdded(q, (snapshot) => {
        const data = snapshot.val();
        if (data?.storyId) {
            callback(data.storyId);
        }
    });
}

async function isLikeStory(storyId: string, username: string): Promise<boolean> {
    const storyRef = ref(db, `stories_like/${storyId}/${username}`);
    const snapshot = await get(storyRef);
    return snapshot.exists();
}

async function likeStory(storyId: string, username: string) {
    const storyRef = ref(db, `stories_like/${storyId}/${username}`);
    await set(storyRef, true);
    const likeCountRef = ref(db, `stories/${storyId}/like`);
    const likeSnapshot = await get(likeCountRef);
    await set(ref(db, `stories/${storyId}/like`), likeSnapshot.val() + 1);
}

async function viewStory(storyId: string) {
    const storyRef = ref(db, `stories/${storyId}/view`);
    const viewSnapshot = await get(storyRef);
    await set(storyRef, viewSnapshot.val() + 1);
}

export {
    handleChangeProfile,
    getUserProfile,
    getInvitation,
    createGroup,
    changeStatusRoomResponse,
    getInforGroup,
    getAllInforGroup,
    getAllProfile,
    createStory,
    LoadStoryFeed,
    likeStory,
    isLikeStory,
    viewStory,
};
