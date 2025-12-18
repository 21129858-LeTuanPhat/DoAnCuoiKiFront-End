import { createContext, useState } from 'react';
import { BoardContextType } from '../../../model/BoardContextType';
import { BoardProviderProps } from '../../../model/BoardProviderProps';

const BoardContext = createContext<BoardContextType | null>(null);

function BoardProvider({ children }: BoardProviderProps) {
    const [selectedUser, setSelectedUser] = useState<string>('');

    return <BoardContext.Provider value={{ selectedUser, setSelectedUser }}>{children}</BoardContext.Provider>;
}

export { BoardContext, BoardProvider };
