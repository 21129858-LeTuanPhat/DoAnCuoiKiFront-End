import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';
import { ChatMessage } from '../../../model/ChatMessage';
import { useEffect } from 'react';
import { getUserProfile } from '../../../services/firebaseService';
import ProfileForm from '../../../model/ProfileForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ProfileContextType } from '../../../model/ProfileContextType';

const ProfileContext = createContext<ProfileContextType | null>(null);

function ProfileProvider({ children }: { children: React.ReactNode }) {
    const user = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(true);

    const [profileInfor, setProfileInfor] = useState<ProfileForm | null>({
        username: user.username!,
        fullName: '',
        address: '',
        introduce: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getUserProfile(user.username!);
                if (profileData) {
                    setProfileInfor(profileData);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div></div>;
    }

    return (
        <ProfileContext.Provider
            value={{
                profileInfor,
                setProfileInfor,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileProvider };
