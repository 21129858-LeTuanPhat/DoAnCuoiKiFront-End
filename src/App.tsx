import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Home from './pages/ChatAppPage';
import WebSocketManager from './socket/WebSocketManager';
import { useState, useEffect } from 'react';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<SignInPage></SignInPage>}></Route>
                    <Route path="/" element={<Home></Home>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
