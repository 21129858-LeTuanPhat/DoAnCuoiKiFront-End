import Footer from '../components/chat/messageboard/Footer';
import Header from '../components/chat/messageboard/Header';
import MainContent from '../components/chat/messageboard/MainContent';
import SideBar from '../components/chat/sidebar/SideBar';

function Home() {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="hidden md:block flex-[2.5]">
                <SideBar />
            </aside>
            <main className="flex-[7.5]  flex flex-col bg-[#f0f4fa] max-h-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]">
                <Header />
                <MainContent />
                <Footer />
            </main>
        </div>
    );
}
export default Home;
