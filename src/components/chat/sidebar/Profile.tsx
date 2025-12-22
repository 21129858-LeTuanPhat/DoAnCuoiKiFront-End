import { CircleChevronDown, CircleChevronUp, UserCircle, BellRing, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
export function Profile() {
    const user = useSelector((state: RootState) => state.user);
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="flex justify-between items-center bg-gray-200 shadow-sm w-full p-2  my-1 rounded-xl select-none ">
                <div className="flex gap-3 items-center ">
                    <img
                        src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-[#3e4040] font-medium text-lg hover:">{user.username}</p>
                </div>

                {open ? (
                    <CircleChevronUp
                        color={'#fffcfc'}
                        className="cursor-pointer"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    />
                ) : (
                    <CircleChevronDown
                        color={'#fffcfc'}
                        className="cursor-pointer"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    />
                )}

                {open && ProfilePopup(user.username ?? '', () => setOpen(false))}
            </div>
        </>
    );
}

function ProfilePopup(username: string, onClose: () => void) {
    return (
        <div
            className="absolute -right-96 bottom-4 w-96 p-2 bg-gray-100 shadow-lg rounded-3xl border-2 border-gray-200
         transition-all z-10 duration-300 ease-out "
        >
            <div className="flex flex-col p-2 w-full">
                <div className="flex gap-3 items-center ">
                    <img
                        src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                    />
                    <p className="text-[#3e4040] font-medium text-sm hover:">{username}</p>
                </div>
                <SeparatorHorizontal />

                <div className="flex gap-x-4 mb-4">
                    <UserCircle color="#3e4040" />
                    <p className="text-[#3e4040] font-medium text-sm hover:text-[#474e4e]">Xem trang cá nhân</p>
                </div>

                <div className="flex gap-x-4">
                    <BellRing color="#3e4040" />
                    <p className="text-[#3e4040] font-medium text-sm hover:text-[#474e4e]">Thông báo</p>
                </div>

                <SeparatorHorizontal />

                <div className="flex gap-x-4">
                    <LogOut color="#f53d1d" />
                    <p className="text-[#f53d1d] font-medium text-sm hover:text-[#f90000]">Đăng xuất</p>
                </div>
            </div>
        </div>
    );
}

function SeparatorHorizontal() {
    return <div className="w-full h-[1.5px] bg-gray-300 my-3 rounded-xl "></div>;
}
//
