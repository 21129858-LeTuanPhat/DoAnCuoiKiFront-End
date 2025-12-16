
import './index.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Home from './pages/ChatAppPage';
import WebSocketManager from './socket/WebSocketManager';
import SignUpPage from './pages/SignUpPage';

function App() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const ws = WebSocketManager.getInstance();
        ws.connect2('wss://chat.longapp.site/chat/chat')
            .then(() => {
                ws.sendMessage(
                    JSON.stringify({
                        action: 'onchat',
                        data: {
                            event: 'LOGIN',
                            data: {
                                user: 'phucabc',
                                pass: '123',
                            },
                        },
                    }),
                );

                ws.onMessage((mes) => {
                    if (mes.status === 'success' && mes.event === 'LOGIN') {
                        console.log('Login successful:', mes.data);
                        setReady(true);
                    }
                });
            })
            .catch(() => {
                console.error('WS connect failed');
            });
    }, []);

    if (!ready) {
        return <div className="h-screen flex items-center justify-center">Đang kết nối server...</div>;
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<SignInPage></SignInPage>}></Route>
                    <Route path="/" element={<Home></Home>}></Route>
                    <Route path='/registry' element={<SignUpPage></SignUpPage>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
