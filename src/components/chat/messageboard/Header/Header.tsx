
import { faLocationCrosshairs, faLocationDot, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';        
import { IdCard, PanelLeft, UserPlus,  MapPin, Pin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { avatarDefault, REACT_BASE_URL } from '../../../../config/utils';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import LocationModal from '../../../modal/LocationModal';

import CallModal from '../../../modal/CallModal';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { TypeMess } from '../../../../model/ChatMessage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { CallStatus } from '../../../../model/CallProps';
import { Dispatch } from '@reduxjs/toolkit';
import ListUserGroup from './ListUserGroup';

import { memo } from 'react';
import React from 'react';

import ModalAddUser from './ModalAddUser';
import { ProfileContext } from '../../Context/ProfileCotext';
import { getImageUrl } from '../../../../services/firebaseService';
import ShareCardModal from '../../sidebar/ShareCard';

function Header({
    darkMode,
    username,
    setOpen,
    setTypeCalling,
    onReload,
    setOpenPinModal
}: {
    darkMode: boolean;
    username: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTypeCalling: React.Dispatch<React.SetStateAction<number>>;
    onReload?: () => void;
    setOpenPinModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { selectedUser, type: typeMessage } = useBoardContext();
    const { type } = useBoardContext();
    console.log('selected user nè header', type)
    const [openPanel, setOpenPanel] = useState<boolean>(false);
    const profileInfor = useContext(ProfileContext)?.profileInfor;
    const [openAddUser, setOpenAddUser] = useState<boolean>(false);

     const [openLocationModal, setOpenLocationModal] = useState<boolean>(false);    
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [openShareModal, setOpenShareModal] = useState(false);
    useEffect(() => {
        const fetchImage = async () => {
            const imageUrl = await getImageUrl(username);
            if (imageUrl) {
                setImageUrl(imageUrl);
            }
        };
        fetchImage();
    }, [username]);
    const hanldeVoice = () => {
        setOpen(true);
        setTypeCalling(TypeMess.VOICE_CALL);
    };
    const hanldeVideo = () => {
        setOpen(true);
        setTypeCalling(TypeMess.VIDEO_CALL);
    };
    const selector = useSelector((state: RootState) => state.call);
    useEffect(() => {
        if (selector.callStatus === CallStatus.REJECT) {
            setOpen(false);
        }
    }, [selector.callStatus]);
    return (
        <>

            {openLocationModal && <LocationModal onReload={onReload} isOpen={openLocationModal} onClose={() => setOpenLocationModal(false)} />}
            {openAddUser && <ModalAddUser openAddUser={openAddUser} setOpenAddUser={setOpenAddUser} />}
            {openPanel && <ListUserGroup openPanel={openPanel} setOpenPanel={setOpenPanel} />}
            <div
                className={`flex items-center h-full justify-between px-4 py-3  ${
                    darkMode === false ? 'bg-white' : 'bg-[#232230]'
                } overflow-auto`}
            >
                <div className="flex items-center">
                    {typeMessage === 'room' && (
                        <div
                            className={`relative before:content-[''] before:h-[24px] before:border-l-2 before:absolute before:top-1/2 before:left-14 before:bg-red-500 before:-translate-y-1/2
                         ${darkMode === false ? 'hover:bg-gray-300' : 'hover:bg-neutral-100'} rounded-full transition`}
                        >
                            <PanelLeft
                                onClick={() => setOpenPanel(true)}
                                className={
                                    darkMode === false
                                        ? 'ml-4 mr-8 h-[36px] cursor-pointer'
                                        : 'ml-4 mr-8 h-[36px] cursor-pointer text-blue-600'
                                }
                            />
                        </div>
                    )}
                    <img
                        src={imageUrl ? imageUrl : avatarDefault}
                        className={'rounded-full object-cover w-10 h-10 mx-2'}
                    />
                    <h3
                        className={
                            darkMode === false
                                ? 'mx-2 text-[23px] font-semibold'
                                : 'mx-2 text-[23px] font-semibold text-slate-300'
                        }
                    >
                        {username}
                    </h3>
                </div>
                <div className="flex items-center gap-4">
                    {typeMessage === 'room' && (
                        <button
                            onClick={() => setOpenAddUser(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                        >
                            <UserPlus className="text-lg text-blue-600 text-[20px]" />
                        </button>
                    )}
                    {typeMessage === 'people' && (
                        <IdCard
                            color="blue"
                            size={20}
                            className="cursor-pointer"
                            onClick={() => setOpenShareModal(true)}
                        />
                    )}
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                        onClick={() => setOpenPinModal(true)}
                        title="Ghim thông báo"
                    >
                        <Pin className="text-lg text-blue-600 w-5 h-5" />
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                        onClick={() => setOpenLocationModal(true)}
                        title="Chia sẻ vị trí của bạn"
                    >
                        <FontAwesomeIcon icon={faLocationDot} className="text-lg text-blue-600 text-[20px]" />

                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                        onClick={hanldeVoice}
                    >
                        <FontAwesomeIcon icon={faPhone} className="text-lg text-blue-600 text-[20px]" />
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition "
                        onClick={hanldeVideo}
                    >
                        <FontAwesomeIcon icon={faVideo} className="text-lg text-blue-600 text-[20px]" />
                    </button>
                </div>
                {openShareModal && <ShareCardModal onClose={() => setOpenShareModal(false)} sharedName={username} />}
            </div>{' '}
        </>
    );
}

export default React.memo(Header);

