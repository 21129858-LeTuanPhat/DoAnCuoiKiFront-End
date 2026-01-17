import React, { useRef, useState } from 'react';
import '../../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserLogin } from '../../model/User';
import { UserStar } from 'lucide-react';
import { loginWS } from '../../socket/UserWS';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { userAction, logOut } from '../../redux/userReducer';

interface FormLoginProps {
    user: UserLogin;
    setUser: React.Dispatch<React.SetStateAction<UserLogin>>;
}
export default function FormLogin({ user, setUser }: FormLoginProps) {
    const navigate = useNavigate();
    const [error, setError] = useState<{ username: string; password: string }>({ username: '', password: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [responseLogin, setResponseLogin] = useState<string>('');

    console.log(user);
    const handleForm = (): boolean => {
        setError({ username: '', password: '' });
        let isValid = true;
        if (user.username.trim() === '') {
            console.log('err name');
            error.username = 'Tên đăng nhập không được bỏ trống';
            setError((err) => ({ ...err, username: 'Tên đăng nhập không được bỏ trống' }));
            isValid = false;
        }
        if (user.password.trim() === '') {
            console.log('err pass');
            error.password = 'Mật khẩu không được bỏ trống';
            setError((err) => ({ ...err, password: 'Mật khẩu không được bỏ trống' }));
            isValid = false;
        }
        return isValid;
    };
    const dispatch = useDispatch();
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (handleForm()) {
            setLoading(true);
            const responeWS = await loginWS(user);
            setLoading(false);
            if (responeWS.status === 'error') {
                setResponseLogin(responeWS.message);
                return;
            }
            if (responeWS.username && responeWS.reCode) {
                dispatch(userAction({ username: responeWS.username, reCode: responeWS.reCode }));
                navigate('/');
            }
        }
    };
    if (loading) {
        return <CircularProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />;
    }
    return (
        <>
            <div className=" w-1/3 p-3 bg-white shadow-md rounded-md">
                <p className="font-bold text-center mb-3">Đăng nhập tài khoản</p>

                <form className="rounded px-8 pt-6 pb-8 mb-4  border-t-2" onSubmit={(e) => submitForm(e)}>
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tên đăng nhập</label>
                        <input
                            value={user.username}
                            className={`shadow mb-2 appearance-none border ${error.username.trim() !== '' ? 'border-red-500' : ''
                                } rounded w-full py-2 px-3  ${responseLogin.trim() !== '' ? 'border-red-500' : ''
                                } text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            id="username"
                            type="text"
                            placeholder="Tên đăng nhập"
                            onChange={(e) => setUser((user) => ({ ...user, username: e.target.value }))}
                        />
                        {error.username && <p className="text-red-500 text-xs italic">Vui lòng nhập tên đăng nhập</p>}
                        {responseLogin && <p className="text-red-500 text-xs italic">{responseLogin}</p>}
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                        <input
                            value={user.password}
                            className={`shadow appearance-none border   ${responseLogin.trim() !== '' ? 'border-red-500' : ''
                                } rounded w-full py-2 px-3  ${error.password.trim() !== '' ? 'border-red-500' : ''
                                } text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline`}
                            id="password"
                            type="password"
                            placeholder="********"
                            onChange={(e) => setUser((user) => ({ ...user, password: e.target.value }))}
                        />
                        {error.password && <p className="text-red-500 text-xs italic">Vui lòng nhập mật khẩu</p>}
                        {/*  */}
                        <div className="flex justify-end">
                            <Link to="/register" className="text-blue-500 text-sm hover:underline">
                                Đăng kí tài khoản?
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button className="inline-block align-baseline font-bold text-sm text-blue-500 ">
                            Quên mật khẩu
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">&copy;2025 Acme Corp. All rights reserved.</p>
            </div>
        </>
    );
}
