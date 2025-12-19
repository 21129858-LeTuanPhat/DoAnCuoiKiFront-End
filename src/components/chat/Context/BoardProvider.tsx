import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';
import { ChatMessage } from '../../../model/ChatMessage';

const BoardContext = createContext<BoardContextType | null>(null);

function BoardProvider({ children }: BoardProviderProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [listMessage, setListMessage] = useState<ChatMessage[]>([]);

    return (
        <BoardContext.Provider value={{ selectedUser, setSelectedUser, listMessage, setListMessage }}>
            {children}
        </BoardContext.Provider>
    );
}

export { BoardContext, BoardProvider };
