import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/ChatAppPage';
import { Login } from '@mui/icons-material';
import SignUpPage from '../pages/SignUpPage';
import SignInPage from '../pages/SignInPage';

export const routers = createBrowserRouter(
    [
        {
            path: '/',
            element: <Home/>,
        },
        {
            path: '/login',
            element: <SignInPage/>,
        },
        {
            path: '/register',
            element: <SignUpPage/>,
        }
    ],
);