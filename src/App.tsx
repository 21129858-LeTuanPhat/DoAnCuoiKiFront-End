

import { BrowserRouter, Outlet, Route, RouterProvider, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Home from './pages/ChatAppPage';
import SignUpPage from './pages/SignUpPage';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import {routers} from './routes/router'

function App() {
    const user = useSelector((state: RootState) => state.user)
    console.log(user)

    return (
        <div>
            <RouterProvider router={routers}>
                <Outlet/>
            </RouterProvider>
        </div>
    );
}
export default App;
