import Footer from '../components/chat/messageboard/Footer';
import Header from '../components/chat/messageboard/Header';
import MainContent from '../components/chat/messageboard/MainContent';
import Welcome from '../components/chat/messageboard/Welcome';
import SideBar from '../components/chat/sidebar/SideBar';
import { useBoardContext } from '../hooks/useBoardContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import WebSocketManager from '../socket/WebSocketManager';
import { ChatMessage } from '../model/ChatMessage';
function Home() {
    const { selectedUser } = useBoardContext();
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    console.log('selected user home' + selectedUser);
    // useEffect(() => {
    //     if (!user.username) {
    //         navigate('/login', { replace: true });
    //     }
    // }, [user.username, navigate]);

    //  user.username == null ? (
    //     <div></div>
    // ) :

    useEffect(() => {
        const socket = WebSocketManager.getInstance()
        socket.onMessage("haha", (msg: any) => {
            console.log('socket: ', msg)
            if (msg.status === 'success' && msg.event === 'SEND_CHAT') {

                const newMessage: ChatMessage = {
                    id: msg.data.id,
                    name: msg.data.name,
                    type: msg.data.type,
                    to: msg.data.to,
                    mes: decodeURIComponent(msg.data.mes),
                    createAt: new Date().toISOString(),
                };
                console.log('new mess', newMessage)
            }

        });

    }, [])
    return (
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
    );
}
export default Home;
