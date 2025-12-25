import { Camera } from 'lucide-react'
import React from 'react'
import { ChatMessage } from '../../../model/ChatMessage'
import { useBoardContext } from '../../../hooks/useBoardContext';
export default function ContentItemCall({ message }: { message: ChatMessage }) {

    const { selectedUser, type } = useBoardContext();
    const username = localStorage.getItem('username')

    return type === 'people' ? (selectedUser === message.name ? (<div className="mt-4 flex items-end w-full ">
        <img
            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
            alt="hình ảnh"
            className="rounded-full w-8 h-8 mr-2 align-bottom   "
        />
        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            {/* Header với icon điện thoại và X */}
            <div className="flex items-start gap-4 mb-2">
                <div className="bg-gray-100 rounded-full p-3">
                    {/* <Phone className="w-6 h-6 text-gray-700" /> */}
                    {/* <PhoneOff className="w-6 h-6 text-red-700" /> */}
                    {/* <CameraOff className="w-6 h-6 text-red-700" /> */}
                    <Camera className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Đã bỏ lỡ cuộc gọi thoại
                    </h2>
                    {/* <p className="text-sm text-gray-500">13:51</p> */}
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                Gọi lại
            </button>
        </div>
    </div>) : (<div className="mt-4 flex items-end w-full justify-end">

        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            {/* Header với icon điện thoại và X */}
            <div className="flex items-start gap-4 mb-2">
                <div className="bg-gray-100 rounded-full p-3">
                    {/* <Phone className="w-6 h-6 text-gray-700" /> */}
                    {/* <PhoneOff className="w-6 h-6 text-red-700" /> */}
                    {/* <CameraOff className="w-6 h-6 text-red-700" /> */}
                    <Camera className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Đã bỏ lỡ cuộc gọi thoại
                    </h2>
                    {/* <p className="text-sm text-gray-500">13:51</p> */}
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                Gọi lại
            </button>
        </div>
    </div>)) : (username !== message.name ? (<div className="mt-4 flex items-end w-full ">
        <img
            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
            alt="hình ảnh"
            className="rounded-full w-8 h-8 mr-2 align-bottom   "
        />
        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4 ">
            {/* Header với icon điện thoại và X */}
            <div className="flex items-start gap-4 mb-2">
                <div className="bg-gray-100 rounded-full p-3">
                    {/* <Phone className="w-6 h-6 text-gray-700" /> */}
                    {/* <PhoneOff className="w-6 h-6 text-red-700" /> */}
                    {/* <CameraOff className="w-6 h-6 text-red-700" /> */}
                    <Camera className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Đã bỏ lỡ cuộc gọi thoại
                    </h2>
                    {/* <p className="text-sm text-gray-500">13:51</p> */}
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                Gọi lại
            </button>
        </div>
    </div>) : (<div className="mt-4 flex items-end w-full justify-end">
        <img
            src="https://tse3.mm.bing.net/th/id/OIP.cGz8NopJvAgdkioxkugKoQHaHa?pid=Api&P=0&h=220"
            alt="hình ảnh"
            className="rounded-full w-8 h-8 mr-2 align-bottom   "
        />
        <div className="bg-white rounded-3xl shadow-lg p-4 w-1/4  ">
            {/* Header với icon điện thoại và X */}
            <div className="flex items-start gap-4 mb-2">
                <div className="bg-gray-100 rounded-full p-3">
                    {/* <Phone className="w-6 h-6 text-gray-700" /> */}
                    {/* <PhoneOff className="w-6 h-6 text-red-700" /> */}
                    {/* <CameraOff className="w-6 h-6 text-red-700" /> */}
                    <Camera className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Đã bỏ lỡ cuộc gọi thoại
                    </h2>
                    {/* <p className="text-sm text-gray-500">13:51</p> */}
                </div>
            </div>
            {/* Nút Gọi lại */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-xl text-sm transition-colors">
                Gọi lại
            </button>
        </div>
    </div>))

}
