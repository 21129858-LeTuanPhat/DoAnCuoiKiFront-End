import ProfileForm from './ProfileForm';

export interface ProfileContextType {
    profileInfor: ProfileForm | null;
    setProfileInfor: React.Dispatch<React.SetStateAction<ProfileForm | null>>;
}
