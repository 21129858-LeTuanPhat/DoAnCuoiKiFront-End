import Footer from '../components/chat/messageboard/Footer/Footer';
import Header from '../components/chat/messageboard/Header/Header';
import MainContent from '../components/chat/messageboard/MainContent/MainContent';
import Welcome from '../components/chat/messageboard/MainContent/Welcome';
import SideBar from '../components/chat/sidebar/SideBar';
import { useBoardContext } from '../hooks/useBoardContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { incomingCall } from '../redux/callReducer';
import WebSocketManager from '../socket/WebSocketManager';
import { ChatMessage, ISendMessage, TypeMess } from '../model/ChatMessage';
import { CallInterface, CallStatus } from '../model/CallProps';
import RingingModal from '../components/modal/RingingModal';
import CallModalPage from '../components/modal/CallModalPage';
import EndCallModal from '../components/modal/EndCallModal';
import CancelModal from '../components/modal/CancelModal';
import TimeOutModal from '../components/modal/TimeOutModal';
import RejectModal from '../components/modal/RejectModal';
import BusyModal from '../components/modal/BusyModal';
import CallModal from '../components/modal/CallModal';
import { createContext } from 'react';
import { useCurrentLocation } from '../components/Location/CurrentLocation';
import PinMessageModal from '../components/modal/PinMessageModal';

export interface ICallContext {
    setModalCalling: React.Dispatch<React.SetStateAction<boolean>>;
    setTypeCalling: React.Dispatch<React.SetStateAction<number>>;
    refStatusIncall: MutableRefObject<boolean>;
}
export const CallContext = createContext<ICallContext | null>(null);

interface PinnedMessage {
    id: number;
    title: string;
    content: string;
    importance: 'low' | 'medium' | 'high';
    timestamp: Date;
}

function Home() {
    const [re, setRe] = useState<number>(0)

    const { listMessage, setListMessage, selectedUser } = useBoardContext();
    const callStore = useSelector((state: RootState) => state.call);
    const [modalCalling, setModalCalling] = useState(false);
    const [typeCalling, setTypeCalling] = useState<number>(100);

    const [showPinModal, setShowPinModal] = useState(false);



    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const refStatusIncall = useRef<boolean>(false)
    useEffect(() => {
        console.log('refStatusIncall trong chat app', refStatusIncall)

    }, [refStatusIncall])
    useEffect(() => {
        if (callStore.callStatus === CallStatus.BUSY ||
            callStore.callStatus === CallStatus.REJECT ||
            callStore.callStatus === CallStatus.ENDED ||
            callStore.callStatus === CallStatus.TIMEOUT ||
            callStore.callStatus === CallStatus.IN_CALL) {
            setModalCalling(false)
        }
    }, [callStore.callStatus])
    console.log('selected user home' + selectedUser);
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state.call);

    return (
        <>
            <CallContext.Provider value={{ setModalCalling, setTypeCalling, refStatusIncall }}>
                {callStore.callStatus === CallStatus.RINGING && <RingingModal open={true} onReload={() => setRe(prev => prev + 1)} />}
                {selection.callStatus === CallStatus.IN_CALL && <CallModalPage></CallModalPage>}
                {selection.callStatus === CallStatus.ENDED && <EndCallModal open={true} onReload={() => setRe(prev => prev + 1)}></EndCallModal>}
                {selection.callStatus === CallStatus.CANCEL && <CancelModal open={true} onReload={() => setRe(prev => prev + 1)}></CancelModal>}
                {selection.callStatus === CallStatus.REJECT && (<RejectModal open={true} onReload={() => setRe(prev => prev + 1)}></RejectModal>)}
                {selection.callStatus === CallStatus.BUSY && (<BusyModal open={true} onReload={() => setRe(prev => prev + 1)}></BusyModal>)}
                {(selection.callStatus === CallStatus.TIMEOUT) && <TimeOutModal open={true} onReload={() => setRe(prev => prev + 1)}></TimeOutModal>}

                {modalCalling && <CallModal open={modalCalling} setOpen={setModalCalling} typeCall={typeCalling} />}

                <div className="flex h-screen ">
                    <aside className="hidden md:block w-[25%] relative">
                        <SideBar />
                    </aside>
                    <main className="w-[75%]  md:block flex flex-col bg-[#f0f4fa] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]">
                        {selectedUser === '' ? (
                            <Welcome />
                        ) : (
                            <div className="flex flex-col h-full overflow-hidden relative">
                                <Header
                                    username={selectedUser}
                                    setOpen={setModalCalling}
                                    setTypeCalling={setTypeCalling}
                                    onReload={() => setRe(prev => prev + 1)}
                                    setOpenPinModal={setShowPinModal}
                                />
                                <MainContent
                                    key={selectedUser}
                                    re={re}
                                    username={selectedUser}
                                    setRe={setRe}
                                    showPinModal={showPinModal}
                                    setShowPinModal={setShowPinModal}
                                />
                                <Footer username={selectedUser} />
                            </div>
                        )}
                    </main>
                </div>
            </CallContext.Provider>
        </>
    );
}
export default Home;