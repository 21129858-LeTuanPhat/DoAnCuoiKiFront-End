import { Dispatch, SetStateAction } from 'react';
import { ChatMessage } from './ChatMessage';
import { Member } from './Member';

export interface BoardContextType {
    selectedUser: string;
    setSelectedUser: Dispatch<SetStateAction<string>>;
    listMessage: ChatMessage[];
    setListMessage: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    right: boolean;
    setRight: React.Dispatch<React.SetStateAction<boolean>>;
    owner: string;
    setOwner: React.Dispatch<React.SetStateAction<string>>;
    listMember: Member[];
    setListMember: React.Dispatch<React.SetStateAction<Member[]>>;
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    //Dùng thằng này thì nó mới địnhg nghĩa giống React về set khi dùng useState
    //     setSelectedUser('Nam');
    // setSelectedUser((prev) => 'Nam');
    // setSelectedUser((prev) => prev);
}
