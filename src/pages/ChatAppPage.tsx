import SideBar from '../components/chat/sidebar/SideBar';

function Home() {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="hidden md:block flex-[2.5]">
                <SideBar />
            </aside>
            <main className="flex-[7.5]  flex flex-col bg-white">
                <header className="bg-gray-400">Header</header>
                <section className="bg-blue-400">Main Content</section>
                <footer className="bg-gray-400">Footer</footer>
            </main>
        </div>
    );
}
export default Home;
