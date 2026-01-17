import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';
import { ChatMessage } from '../../../model/ChatMessage';
import { Member } from '../../../model/Member';
import { AIRecommendation } from '../../../model/AIRecommendation';
import { User } from '../../../model/User';
const BoardContext = createContext<BoardContextType | null>(null);

function BoardProvider({ children }: BoardProviderProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [listMessage, setListMessage] = useState<ChatMessage[]>([]);
    const [type, setType] = useState<string>('');
    const [right, setRight] = useState<boolean>(false);
    const [owner, setOwner] = useState<string>('');
    const [listMember, setListMember] = useState<Member[]>([]);
    const [recommended, setRecommended] = useState<AIRecommendation>({ input: '', reply: [] });
    const [openRecommendation, setOpenRecommendation] = useState<boolean>(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [encodeEmoji, setEncodeEmoji] = useState<boolean>(false);

    return (
        <BoardContext.Provider
            value={{
                selectedUser,
                setSelectedUser,
                listMessage,
                setListMessage,
                type,
                setType,
                right,
                setRight,
                owner,
                setOwner,
                listMember,
                setListMember,
                recommended,
                setRecommended,
                openRecommendation,
                setOpenRecommendation,
                userList,
                setUserList,
                darkMode,
                setDarkMode,
                encodeEmoji,
                setEncodeEmoji,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}
export { BoardContext, BoardProvider };
