import { CircleX, Camera, Heart } from 'lucide-react';

export function InforProfile({ onClose, username }: { onClose: () => void; username: string }) {
    return (
        <div
            className="fixed inset-0 p-2 bg-black/40
         animate-in slide-in-from-right-80 duration-300 ease-out items-center flex flex-col justify-between"
        >
            <div className="flex flex-col  bg-white w-full max-w-xl h-full rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    <CircleX className="cursor-pointer" onClick={onClose} />
                </div>

                <div
                    className="flex items-center mt-6 p-10 
                bg-gradient-to-r from-blue-700 to-pink-400 rounded-xl gap-4"
                >
                    <div className="relative">
                        <img
                            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
                            alt=""
                            className=" w-20 h-20 rounded-full object-cover  border-4 border-white shadow-lg"
                        />
                        <div className="absolute right-0 bottom-0 p-2 rounded-full bg-blue-100">
                            <Camera size={14} color="#03aeec" className="" />
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col">
                        <p className="text-white font-semibold text-2xl">{username}</p>
                        <p className="text-gray-300 font-normal text-md opacity-70">
                            Xin chào! Đây là trang cá nhân của tôi.
                        </p>
                    </div>

                    <div className="flex justify-end items-center">
                        <div className="px-2 py-1 bg-white bg-opacity-30 rounded-3xl cursor-pointer">
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-200"></div>
                                <p className="text-red-500 text-sm font-medium">Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                <InforProfileDetail />
            </div>
        </div>
    );
}

function InforProfileDetail() {
    return (
        <div className="flex flex-col  gap-4 mt-6 shadow-2xl p-4 rounded-2xl border border-gray-200">
            <div className="flex gap-2 items-center">
                <Heart color="red" />
                <p className="font-semibold text-lg">Thông tin chi tiết</p>
            </div>
            <p className="text-md text-gray-600 opacity-70">
                Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn tại đây
            </p>
            <div className="grid grid-cols-2 gap-4">
                <InputInforProfile label="Họ và tên" placeholder="Nhập họ và tên" type="text" />
                <InputInforProfile label="Địa chỉ" placeholder="Nhập địa chỉ" type="text" />
            </div>
            <label htmlFor="introduce" className="text-md font-semibold text-black mb-2 ">
                Giới thiệu bản thân
            </label>
            <textarea
                id="introduce"
                className="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none"
                placeholder="Nhập giới thiệu về bản thân"
            />

            <div className="flex justify-center items-center mt-4">
                <button className="w-64 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
}

function InputInforProfile({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
    return (
        <div>
            <label htmlFor={label.toLowerCase()} className="text-md font-semibold text-black mb-2 ">
                {label}
            </label>
            <input
                id={label.toLowerCase()}
                type={type}
                className="px-3 py-2 mt-2 border rounded-lg focus:outline-none"
                placeholder={placeholder}
            />
        </div>
    );
}
