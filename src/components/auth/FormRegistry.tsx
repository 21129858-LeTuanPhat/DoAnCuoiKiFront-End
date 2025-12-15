import React from 'react'
import { Link } from 'react-router-dom'

export default function FormRegistry() {
    return (
        <>
            <div className=" w-1/3 p-3 bg-white shadow-md rounded-md" >
                <p className='font-bold text-center mb-3'>Đăng kí tài khoản</p>
                <form className="rounded px-8 pt-6 pb-8 mb-4  border-t-2" >
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Tên đăng nhập
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Tên đăng nhập" />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mật khẩu
                        </label>
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" />
                        {/* <p className="text-red-500 text-xs italic mt-1 ">Please choose a password.</p> */}
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Nhập lại mật khẩu
                        </label>
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" />
                        {/* <p className="text-red-500 text-xs italic mt-1">Please choose a password.</p> */}
                        <div className="flex justify-end">
                            <Link to="/login" className="text-blue-500 text-sm hover:underline mt-3">
                                Bạn đã có tài khoản?
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="button">
                            Đăng kí
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2025 Acme Corp. All rights reserved.
                </p>
            </div >
        </>
    )
}
