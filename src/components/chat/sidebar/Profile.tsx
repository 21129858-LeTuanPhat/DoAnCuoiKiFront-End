import { CircleChevronDown, CircleChevronUp, UserCircle, BellRing, LogOut } from 'lucide-react';
import { useState } from 'react';

import { InforProfile } from './InforProfile';
import { useContext } from 'react';
import { ProfileContext } from '../Context/ProfileCotext';
import { Notification } from './Notification';
import { avatarDefault } from '../../../config/utils';
export function Profile({ darkMode }: { darkMode: boolean }) {
    const { profileInfor } = useContext(ProfileContext)!;
    const img_url = profileInfor?.imageUrl ?? avatarDefault;
    const [open, setOpen] = useState(false);

    return (
        <>
            <div
                className={
                    darkMode === false
                        ? 'flex justify-between items-center bg-gray-200 shadow-sm w-full p-2  my-1 rounded-xl select-none '
                        : 'flex justify-between items-center bg-[#24232a] shadow-sm w-full p-2  my-1 rounded-xl select-none'
                }
            >
                <div className="flex gap-3 items-center ">
                    <img src={img_url} className="w-10 h-10 rounded-full object-cover" />
                    <p
                        className={
                            darkMode === false
                                ? 'text-[#3e4040] font-medium text-md '
                                : 'text-white font-medium text-md'
                        }
                    >
                        {profileInfor?.username}
                    </p>
                </div>

                <div className="flex  justify-center items-center h-full">
                    {open ? (
                        <CircleChevronUp
                            color={'#fffcfc'}
                            className="cursor-pointer "
                            onClick={() => {
                                setOpen(!open);
                            }}
                        />
                    ) : (
                        <CircleChevronDown
                            color={'#fffcfc'}
                            className="cursor-pointer "
                            onClick={() => {
                                setOpen(!open);
                            }}
                        />
                    )}
                </div>

                {open && <ProfilePopup username={profileInfor?.username ?? ''} onClose={() => setOpen(false)} />}
            </div>
        </>
    );
}

function ProfilePopup({ username, onClose }: { username: string; onClose: () => void }) {
    const { profileInfor } = useContext(ProfileContext)!;
    const img_url = profileInfor?.imageUrl ?? avatarDefault;
    const [openProfile, setOpenProfile] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    return (
        <div
            className="absolute -right-96 bottom-4 w-96 p-2 bg-gray-100 shadow-lg rounded-3xl border-2 border-gray-200
         transition-all z-10 duration-300 ease-out "
        >
            <div className="flex flex-col p-2 w-full">
                <div className="flex gap-3 items-center ">
                    <img src={img_url} alt={username} className="w-9 h-9 rounded-full object-cover" />
                    <p className="text-[#3e4040] font-medium text-sm hover:">{username}</p>
                </div>
                <SeparatorHorizontal />

                <div className="flex gap-x-4 mb-4 cursor-pointer">
                    <UserCircle color="#3e4040" />
                    <p
                        className="text-[rgb(62,64,64)] font-medium text-sm hover:text-[#474e4e] "
                        onClick={() => setOpenProfile(!openProfile)}
                    >
                        Xem trang cá nhân
                    </p>
                </div>

                <div className="flex gap-x-4">
                    <BellRing color="#3e4040" />
                    <p
                        className="text-[#3e4040] font-medium text-sm hover:text-[#474e4e] cursor-pointer"
                        onClick={() => setOpenNotification(!openNotification)}
                    >
                        Thông báo
                    </p>
                </div>

                <SeparatorHorizontal />

                <div className="flex gap-x-4">
                    <LogOut color="#f53d1d" />
                    <p className="text-[#f53d1d] font-medium text-sm hover:text-[#f90000]">Đăng xuất</p>
                </div>
            </div>

            {openProfile && <InforProfile onClose={() => setOpenProfile(false)} username={username} />}
            {openNotification && (
                <Notification onClose={() => setOpenNotification(false)} onCloseProfile={() => onClose()} />
            )}
        </div>
    );
}

function SeparatorHorizontal() {
    return <div className="w-full h-[1.5px] bg-gray-300 my-3 rounded-xl "></div>;
}
//
