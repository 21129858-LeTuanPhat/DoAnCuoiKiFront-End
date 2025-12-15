import React from 'react';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<SignInPage></SignInPage>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
