import Footer from '../components/chat/messageboard/Footer/Footer';
import Header from '../components/chat/messageboard/Header/Header';
import MainContent from '../components/chat/messageboard/MainContent/MainContent';
import Welcome from '../components/chat/messageboard/MainContent/Welcome';
import SideBar from '../components/chat/sidebar/SideBar';
import { useBoardContext } from '../hooks/useBoardContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
function Home() {

    const { listMessage, setListMessage, selectedUser } = useBoardContext();
    const callStore = useSelector((state: RootState) => state.call);
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    console.log('selected user home' + selectedUser);
    useEffect(() => {
        if (!user.username) {
            navigate('/login', { replace: true });
        }
    }, [user.username, navigate]);
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state.call)
    // useEffect(() => {
    //     const socket = WebSocketManager.getInstance();
    //     socket.onMessage('haha', (msg: any) => {
    //         console.log('socket: ', msg);
    //         if (msg.status === 'success' && msg.event === 'SEND_CHAT') {
    //             const mesObj = JSON.parse(decodeURIComponent(msg.mes));
    //             const newMess: ChatMessage = {
    //                 id: msg.data.id,
    //                 name: msg.data.name,
    //                 type: msg.data.type,
    //                 to: msg.data.to,
    //                 mes: {
    //                     type: mesObj.type,
    //                     data: mesObj.data,
    //                 },
    //                 createAt: new Date().toISOString(),
    //             };

    //             try {
    //                 const obj: ISendMessage = JSON.parse(newMess.mes.data);
    //                 console.log('obj nè bạn ơi', obj);
    //                 if (obj.type === TypeMess.SIGNAL_REQUEST) {
    //                     console.log('signal request');
    //                     if (obj.payload.status === CallStatus.CALLING) {
    //                         console.log('obj mess', obj);
    //                         console.log('obj url', obj.payload.roomURL);
    //                         console.log('name newMess', newMess.name);
    //                         console.log('calling');
    //                         dispatch(
    //                             incomingCall({
    //                                 roomURL: obj.payload.roomURL,
    //                                 roomID: obj.payload.roomID,
    //                                 caller: newMess.name,
    //                                 callMode: obj.payload.callMode,
    //                             }),
    //                         );
    //                     }
    //                 }
    //                 if (obj.type === TypeMess.SIGNAL_RESPONSE) {
    //                     console.log('signal response');
    //                 }

    //                 // if (Object.prototype.toString.call(obj) !== '[object Object]') {
    //                 //     return
    //                 // }
    //                 // if (obj.status === CallStatus.CALLING) {
    //                 //     console.log('obj mess', obj)
    //                 //     console.log('obj url', obj.roomURL)
    //                 //     console.log('name newMess', newMess.name)
    //                 //     console.log('calling')
    //                 //     dispatch(incomingCall({ roomURL: obj.roomURL, roomID: obj.roomID, caller: newMess.name, callMode: obj.callMode }))
    //                 // }
    //             } catch {}
    //         }
    //     });
    // }, []);

    console.log('call store', callStore);
    return (
        <>
            {callStore.callStatus === CallStatus.RINGING && <RingingModal open={true} />}
            {selection.callStatus === CallStatus.IN_CALL && <CallModalPage></CallModalPage>}
            {selection.callStatus === CallStatus.ENDED && <EndCallModal open={true}></EndCallModal>}
            {selection.callStatus === CallStatus.CANCEL && <CancelModal open={true}></CancelModal>}
            {selection.callStatus === CallStatus.REJECT && (<RejectModal open={true}></RejectModal>)}
            {(selection.callStatus === CallStatus.TIMEOUT) && <TimeOutModal open={true}></TimeOutModal>}

            <div className="flex h-screen ">
                <aside className="hidden md:block w-[25%] relative">
                    <SideBar />
                </aside>
                <main className="w-[75%]  md:block flex flex-col bg-[#f0f4fa] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]">
                    {selectedUser === '' ? (
                        <Welcome />
                    ) : (
                        <div>
                            <Header username={selectedUser} />
                            <MainContent key={selectedUser} username={selectedUser} />
                            <Footer username={selectedUser} />
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
export default Home;
