import { Dispatch, SetStateAction } from 'react';
import { ChatMessage } from './ChatMessage';
export interface BoardContextType {
    selectedUser: string;
    setSelectedUser: Dispatch<SetStateAction<string>>;
    listMessage: ChatMessage[];
    setListMessage: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    //Dùng thằng này thì nó mới địnhg nghĩa giống React về set khi dùng useState
    //     setSelectedUser('Nam');
    // setSelectedUser((prev) => 'Nam');
    // setSelectedUser((prev) => prev);
}
