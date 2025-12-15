import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<SignInPage></SignInPage>}></Route>
          <Route path='/registry' element={<SignUpPage></SignUpPage>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
