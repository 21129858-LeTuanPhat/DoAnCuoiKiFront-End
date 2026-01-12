import ProfileForm from './ProfileForm';
import { User } from './User';

export interface ProfileContextType {
    profileInfor: ProfileForm | null;
    setProfileInfor: React.Dispatch<React.SetStateAction<ProfileForm | null>>;
}

export interface ListConversationContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}
