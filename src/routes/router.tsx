import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/ChatAppPage';
import { Login } from '@mui/icons-material';
import SignUpPage from '../pages/SignUpPage';
import SignInPage from '../pages/SignInPage';
import Call from '../pages/Call';
import RootLayout from '../RootLayout';
import CallModalPage from '../components/modal/CallModalPage';

export const routers = createBrowserRouter(
    [{
        element: <RootLayout />,
        children: [{
            path: '/',
            element: <Home />,
        },
        {
            path: '/login',
            element: <SignInPage />,
        },
        {
            path: '/register',
            element: <SignUpPage />,
        },
        {
            path: '/call',
            element: <Call />,
        }, {
            path: '/call-modal',
            element: <CallModalPage />,
        },]
    }
    ],
);