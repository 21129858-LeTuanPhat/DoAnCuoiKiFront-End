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
