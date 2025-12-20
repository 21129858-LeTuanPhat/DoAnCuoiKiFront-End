import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';
import { ChatMessage } from '../../../model/ChatMessage';

const BoardContext = createContext<BoardContextType | null>(null);

function BoardProvider({ children }: BoardProviderProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [listMessage, setListMessage] = useState<ChatMessage[]>([]);
    const [type, setType] = useState<string>('');

    return (
        <BoardContext.Provider value={{ selectedUser, setSelectedUser, listMessage, setListMessage, type, setType }}>
            {children}
        </BoardContext.Provider>
    );
}

export { BoardContext, BoardProvider };
