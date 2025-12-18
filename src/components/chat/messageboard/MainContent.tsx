import { useEffect, useRef, useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { ChatMessage } from '../../../model/ChatMessage';
import ContentItem from './ContentItem';
function MainContent({ username }: { username: string }) {
    const [listMessage, setListMessage] = useState<ChatMessage[]>([]);
    const [page, setPage] = useState<number>(1);
    const divRef = useRef<HTMLDivElement>(null);
    console.log(listMessage.length);
    useEffect(() => {
        console.log('useffect 1');
        setListMessage([]);
        setPage(1);
        return () => {
            console.log('useffect 1 - 1');
        };
    }, [username]);
    useEffect(() => {
        console.log('useffect 2');
        const ws = WebSocketManager.getInstance();
        const off = ws.onMessage('GET_PEOPLE_CHAT_MES', (msg) => {
            if (msg.status === 'success' && msg.event === 'GET_PEOPLE_CHAT_MES') {
                setListMessage((prev) => {
                    const oldScrollHeight = divRef.current?.scrollHeight || 0;
                    const newList = [...msg.data.reverse(), ...prev];
                    setTimeout(() => {
                        const scroll = divRef.current;
                        if (scroll) {
                            scroll.scrollTop = scroll.scrollHeight - oldScrollHeight;
                        }
                    }, 0);
                    return newList;
                });
            }
        });
        ws.sendMessage(
            JSON.stringify({
                action: 'onchat',
                data: {
                    event: 'GET_PEOPLE_CHAT_MES',
                    data: {
                        name: username,
                        page: page,
                    },
                },
            }),
        );
        return () => {
            ws.unSubcribe('GET_PEOPLE_CHAT_MES');
            console.log('useffect 2 - 2');
        };
    }, [username, page]);

    useEffect(() => {
        console.log('useffect 3');
        const div = divRef.current;
        if (!div) return;
        if (page === 1) {
            div.scrollTop = div.scrollHeight;
        }
        const handleScroll = () => {
            if (div.scrollTop === 0 && listMessage.length >= 50) {
                setPage((prev) => {
                    console.log(listMessage.length);
                    console.log(prev);
                    const newpage = prev + 1;
                    return newpage;
                });
            }
        };

        div.addEventListener('scroll', handleScroll);
        return () => {
            console.log('useffect 3 - 3');
            div.removeEventListener('scroll', handleScroll);
        };
    }, [listMessage]);

    return (
        <section className="bg-[#f0f4fa] h-[calc(737.6px-72px-65px)]">
            <div
                ref={divRef}
                className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200"
            >
                <ul className="p-2">
                    {listMessage.map((message, index) => {
                        return <ContentItem message={message} key={index} />;
                    })}
                </ul>
            </div>
        </section>
    );
}

export default MainContent;
