import ConversationGroup from './ConversationGroup';
import ConversationPeople from './ConversationPeople';
import Moji from './Moji';
import { useContext, useEffect, useRef, useState } from 'react';
import WebSocketManager from '../../../socket/WebSocketManager';
import { User } from '../../../model/User';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Profile } from './Profile';
import { ProfileProvider } from '../Context/ProfileCotext';
import { LoadingProfileSkeleton } from '../../modal/LoadingSkeleton';
import FormCreateGroup from './FormCreateGroup';
import FormCreateStory from './FormCreateStory';
import ListStory from './ListStory';
import StoryViewer from './StoryView';
import Story from '../../../model/Story';
import { ListConversationContext } from '../Context/ListConversation';

function SideBar() {
    const loginname = useSelector((state: RootState) => state.user);
    const [openStory, setopenStory] = useState(false);
    const [openStoryView, setOpenStoryView] = useState(false);
    const storiesRef = useRef<Story[]>([]);
    const indexRef = useRef(0);
    const { users, setUsers, loading, setLoading } = useContext(ListConversationContext)!;

    return (
        <div className="flex flex-col h-full w-full *:items-start  p-3 shadow-sm ">
            <Moji />
            <ProfileProvider>
                <ListStory
                    onOpenCreateStory={() => {
                        setopenStory(true);
                    }}
                    onOpenStoryView={(index, stories) => {
                        storiesRef.current = stories;
                        indexRef.current = index;
                        setOpenStoryView(true);
                    }}
                />
            </ProfileProvider>

            <div className="flex-1 w-full overflow-y-auto px-3 py-1 space-y-3">
                <ConversationPeople
                    users={users.filter((user) => user.type === 0 && user.name !== loginname.username)}
                />
                <ConversationGroup users={users.filter((user) => user.type === 1)} />
            </div>

            <ProfileProvider>
                <Profile />
            </ProfileProvider>

            {openStory && <FormCreateStory onClose={() => setopenStory(false)} />}
            {openStoryView && (
                <StoryViewer
                    stories={storiesRef.current}
                    index={indexRef.current}
                    onClose={() => setOpenStoryView(false)}
                />
            )}
        </div>
    );
}
export default SideBar;

// useEffect(() => {
//     const ws = WebSocketManager.getInstance();

//     const off = ws.onMessage((msg) => {
//         console.log('msg:', JSON.stringify(msg, null, 2));
//         if (msg.status == 'success' && msg.event == 'GET_USER_LIST') {
//             console.log('IF');
//             setUsers(msg.data as User[]);
//         }
//     });

//     ws.sendMessage(
//         JSON.stringify({
//             action: 'onchat',
//             data: {
//                 event: 'GET_USER_LIST',
//             },
//         }),
//     );

//     return off;
// }, []);
