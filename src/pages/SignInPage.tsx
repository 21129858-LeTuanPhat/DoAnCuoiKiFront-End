import React, { useState } from 'react';
import FormLogin from '../components/auth/FormLogin';
import { UserLogin } from '../model/User';
import { ClipLoader } from 'react-spinners';
import { CircularProgress } from '@mui/material';
export default function SignInPage() {
    const [user, setUser] = useState<UserLogin>({ username: '', password: '' });
    console.log('hello login');
    return (
        <>
            <div className="login-layout w-full" style={{ backgroundColor: '#e8f3ff', height: '100vh' }}>
                <div className="header-layout justify-center flex">
                    <div className="mt-10 mb-5 text-center w-1/3">
                        <h1 className="font-bold text-4xl " style={{ color: 'rgb(0 104 255)' }}>
                            ZALÔ NHÓM 1
                        </h1>
                        <p className="mt-3 text-sm" style={{ color: 'rgb(51, 51, 51)' }}>
                            Đăng nhập ứng dụng để sử dụng các dịch vụ của chúng tui <br /> Rất vui gặp bạn lúc này
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <FormLogin user={user} setUser={setUser}></FormLogin>
                </div>
            </div>
        </>
    );
}
