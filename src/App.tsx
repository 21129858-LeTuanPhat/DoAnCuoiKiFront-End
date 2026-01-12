import { Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { routers } from './routes/router';
import { useLayoutEffect } from 'react';
import { stat } from 'fs';
import WebSocketManager from './socket/WebSocketManager';
import { error } from 'console';
import { setReCode } from './redux/userReducer';

function App() {


    return (
        <div>
            <RouterProvider router={routers} />
        </div>
    );
}
export default App;
