import { db } from './../config/firebaseConfig';
import { ref, set, get } from 'firebase/database';
import ProfileForm from '../model/ProfileForm';

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

export { handleChangeProfile, getUserProfile };
