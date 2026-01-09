import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';
import { ChatMessage } from '../../../model/ChatMessage';
import { Member } from '../../../model/Member';
const BoardContext = createContext<BoardContextType | null>(null);

function BoardProvider({ children }: BoardProviderProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [listMessage, setListMessage] = useState<ChatMessage[]>([]);
    const [type, setType] = useState<string>('');
    const [right, setRight] = useState<boolean>(false);
    const [owner, setOwner] = useState<string>('');
    const [listMember, setListMember] = useState<Member[]>([]);
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
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}
export { BoardContext, BoardProvider };
