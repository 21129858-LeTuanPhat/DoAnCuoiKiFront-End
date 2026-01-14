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
import CallModal from '../components/modal/CallModal';
import { createContext } from 'react';

export interface ICallContext {
    setModalCalling: React.Dispatch<React.SetStateAction<boolean>>;
    setTypeCalling: React.Dispatch<React.SetStateAction<number>>;
    refStatusIncall: MutableRefObject<boolean>;
}
export const CallContext = createContext<ICallContext | null>(null);

function Home() {
    const [re, setRe] = useState<number>(0)

    const { listMessage, setListMessage, selectedUser } = useBoardContext();
    const callStore = useSelector((state: RootState) => state.call);
    const [modalCalling, setModalCalling] = useState(false);
    const [typeCalling, setTypeCalling] = useState<number>(100);

    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const refStatusIncall = useRef<boolean>(false)
    useEffect(() => {
        console.log('refStatusIncall trong chat app', refStatusIncall)

    }, [refStatusIncall])
    console.log('selected user home' + selectedUser);
    // useLayoutEffect(() => {
    //     if (!user.username) {
    //         // navigate('/login', { replace: true });
    //         return <Navigate to="/login" replace />;
    //     }
    // }, [user.username, navigate]);
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
                            <div>
                                <Header
                                    username={selectedUser}
                                    setOpen={setModalCalling}
                                    setTypeCalling={setTypeCalling}
                                />
                                <MainContent key={re} re={re} username={selectedUser} setRe={setRe} />
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
