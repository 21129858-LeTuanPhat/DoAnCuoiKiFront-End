import Footer from '../components/chat/messageboard/Footer';
import Header from '../components/chat/messageboard/Header';
import MainContent from '../components/chat/messageboard/MainContent';
import Welcome from '../components/chat/messageboard/Welcome';
import SideBar from '../components/chat/sidebar/SideBar';
import { useBoardContext } from '../hooks/useBoardContext';
function Home() {
    const { selectedUser } = useBoardContext();
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="hidden md:block w-[25%]">
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
