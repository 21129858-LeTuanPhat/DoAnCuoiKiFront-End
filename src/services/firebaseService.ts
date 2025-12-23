import { db } from './../config/firebaseConfig';
import { ref, set, get } from 'firebase/database';
import ProfileForm from '../model/ProfileForm';
import RequestConnect from '../model/RequestConnect';

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
        };
    });

    return listConnect as RequestConnect[];
}

export { handleChangeProfile, getUserProfile, getInvitation };
