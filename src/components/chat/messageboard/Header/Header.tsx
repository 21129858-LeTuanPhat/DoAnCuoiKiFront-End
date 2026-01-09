import { PanelLeft } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { avatarDefault, REACT_BASE_URL } from '../../../../config/utils';
import { useContext, useState } from 'react';
import CallModal from '../../../modal/CallModal';
import { useBoardContext } from '../../../../hooks/useBoardContext';
import { ICallMode } from '../../../../model/CallProps';
import ListUserGroup from './ListUserGroup';
import { ProfileContext } from '../../Context/ProfileCotext';
function Header({ username }: { username: string }) {
    // const paddingTop = 50;
    // const paddingLeft = 100;
    // const width = window.innerWidth - paddingLeft * 2;
    // const height = window.innerHeight - paddingTop * 2;
    const [openModal, setModal] = useState(false);
    const [type, setType] = useState<string>('');
    const { selectedUser, type: typeMessage } = useBoardContext();
    const [openPanel, setOpenPanel] = useState<boolean>(false);
    const profileInfor = useContext(ProfileContext)?.profileInfor;
    const hanldeVoice = () => {
        setOpen(true);
        setTypeCalling(TypeMess.VOICE_CALL);
    };
    const hanldeVideo = () => {
        setOpen(true);
        setTypeCalling(TypeMess.VIDEO_CALL);

    };
    const selector = useSelector((state: RootState) => state.call)
    useEffect(() => {
        if (selector.callStatus === CallStatus.REJECT) {
            setOpen(false);
        }
    }, [selector.callStatus]);
    return (
        <>
            {openModal && <CallModal open={openModal} setOpen={setModal} typeCall={type} />}
            {openPanel && <ListUserGroup openPanel={openPanel} setOpenPanel={setOpenPanel} />}
            <div className="flex items-center h-full justify-between px-4 py-3 bg-white overflow-auto">
                <div className="flex items-center">
                    {typeMessage === 'room' && (
                        <div className="relative before:content-[''] before:h-[24px] before:border-l-2 before:absolute before:top-1/2 before:left-14 before:bg-red-500 before:-translate-y-1/2">
                            <PanelLeft
                                onClick={() => setOpenPanel(true)}
                                className="ml-4 mr-8 h-[36px] cursor-pointer"
                            />
                        </div>
                    )}
                    <img
                        src={profileInfor?.imageUrl ?? avatarDefault}
                        alt="hình ảnh"
                        className="rounded-full object-cover w-10 mx-2 h-[36px]"
                    />
                    <h3 className="mx-2 text-[23px] font-semibold">{username}</h3>
                </div>
                <div className="flex items-center gap-4">
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
            </div>{' '}
        </>
    );
}

export default Header;
