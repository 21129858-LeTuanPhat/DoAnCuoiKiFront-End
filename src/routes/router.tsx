import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/ChatAppPage';
import { Login } from '@mui/icons-material';
import SignUpPage from '../pages/SignUpPage';
import SignInPage from '../pages/SignInPage';
import Call from '../pages/Call';
import RootLayout from '../RootLayout';
import CallModalPage from '../components/modal/CallModalPage';
import AuthGate from '../AuthGate';
import { ListConversationProvider } from '../components/chat/Context/ListConversation';
export const routers = createBrowserRouter([
    {
        element: <AuthGate />,
        children: [
            {
                element: <RootLayout />,
                children: [
                    {
                        path: '/',
                        element: (
                            <ListConversationProvider>
                                <Home />
                            </ListConversationProvider>
                        ),
                    },
                    { path: '/call-modal', element: <CallModalPage /> },
                ],
            },
        ],
    },
    { path: '/login', element: <SignInPage /> },
    { path: '/register', element: <SignUpPage /> },
]);
