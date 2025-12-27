import { Outlet, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { routers } from './routes/router';

function App() {
    const user = useSelector((state: RootState) => state.user);
    return (
        <div>
            <RouterProvider router={routers} />
        </div>
    );
}
export default App;
