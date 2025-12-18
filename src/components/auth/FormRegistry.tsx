import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserLogin, UserRegistry } from '../../model/User'
import { registryWS } from '../../socket/UserWS'
import RegistryModal from '../modal/RegistryModal'
import LoadingModal from '../modal/LoadingModal'


type FormRegistryInterface = {
    username: string,
    password: string,
    rePassword: string
}
interface ErrorInterface {
    username: string,
    password: string,
    rePassword: string
}
export default function FormRegistry() {
    const [loading, setLoading] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [formRegistry, setFormRegistry] = useState<FormRegistryInterface>({ username: '', password: '', rePassword: '' })
    const [error, setError] = useState<ErrorInterface>({ username: '', password: '', rePassword: '' })
    const [response, setResponse] = useState<string>('')
    const handleForm = () => {
        setError({ username: '', password: '', rePassword: '' })
        const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        let isValid = true
        if (formRegistry.username.trim() === '') {
            setError(form => ({ ...form, username: 'Vui lòng nhập tên đăng nhập' }))
            isValid = false
        }
        if (formRegistry.password.trim() === '') {
            setError(form => ({ ...form, password: 'Vui lòng mật khẩu' }))
            isValid = false
        }
        if (formRegistry.rePassword.trim() === '') {
            setError(form => ({ ...form, rePassword: 'Vui lòng nhập lại mật khẩu' }))
            isValid = false
        }
        if (formRegistry.rePassword !== formRegistry.password) {

            setError(form => ({ ...form, password: 'Mật khẩu không khớp' }))
            setError(form => ({ ...form, rePassword: 'Mật khẩu không khớp' }))
            isValid = false
        }
        if (!regex.test(formRegistry.password)) {
            setError(form => ({ ...form, password: 'Mật khẩu phải ≥ 8 ký tự, gồm chữ thường, số và ký tự đặc biệt' }))
            setError(form => ({ ...form, rePassword: 'Mật khẩu phải ≥ 8 ký tự, gồm chữ thường, số và ký tự đặc biệt' }))
            isValid = false
        }
        return isValid
    }

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (handleForm()) {
            const user: UserRegistry = { username: formRegistry.username, password: formRegistry.password }
            setLoading(true)
            try {
                const response = await registryWS(user)

                if (response.status === 'success') {
                    setOpenModal(true)
                }
                else {
                    setResponse(response.message)
                }
            } catch (error) {
                setResponse('Đã xảy ra lỗi. Vui lòng thử lại!')
            } finally {
                // Đảm bảo loading luôn được tắt
                setLoading(false)
            }
        }
    }
    return (
        <>
            {
                openModal && (<RegistryModal openModal={openModal}></RegistryModal>)
            }
            <LoadingModal open={loading} />
            <div className=" w-1/3 p-3 bg-white shadow-md rounded-md" >
                <p className='font-bold text-center mb-3'>Đăng kí tài khoản</p>
                <form className="rounded px-8 pt-6 pb-8 mb-4  border-t-2" onSubmit={(e) => submitForm(e)} >
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Tên đăng nhập
                        </label>
                        <input onChange={e => setFormRegistry(form => ({ ...form, username: e.target.value }))} className={`shadow appearance-none border ${error.username || response ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} id="username" type="text" placeholder="Tên đăng nhập" />
                        {
                            error.username && (<p className="text-red-500 text-xs italic mt-1 ">{error.username}</p>)
                        }
                        {
                            response && (<p className="text-red-500 text-sm italic mt-1 ">{response}</p>)
                        }
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mật khẩu
                        </label>
                        <input onChange={e => setFormRegistry(form => ({ ...form, password: e.target.value }))} className={`shadow appearance-none border ${error.password ? 'border-red-500' : ''} rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password" placeholder="********" />
                        {
                            error.password && (<p className="text-red-500 text-xs italic mt-1 ">{error.password}</p>)
                        }
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            onChange={e => setFormRegistry(form => ({ ...form, rePassword: e.target.value }))}
                            className={`shadow appearance-none border ${error.rePassword ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            id="rePassword"
                            type="password"
                            placeholder="********"
                        /> {
                            error.rePassword && (<p className="text-red-500 text-xs italic mt-1 ">{error.rePassword}</p>)
                        }
                        <div className="flex justify-end">
                            <Link to="/login" className="text-blue-500 text-sm hover:underline mt-3">
                                Bạn đã có tài khoản?
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Đăng kí
                        </button>
                    </div>
                </form >
                <p className="text-center text-gray-500 text-xs">
                    &copy;2025 Acme Corp. All rights reserved.
                </p>
            </div >
        </>
    )
}
