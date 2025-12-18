import { Dispatch, SetStateAction } from 'react';

export interface BoardContextType {
    selectedUser: string;
    setSelectedUser: Dispatch<SetStateAction<string>>;
    //Dùng thằng này thì nó mới địnhg nghĩa giống React về set khi dùng useState
    //     setSelectedUser('Nam');
    // setSelectedUser((prev) => 'Nam');
    // setSelectedUser((prev) => prev);
}
