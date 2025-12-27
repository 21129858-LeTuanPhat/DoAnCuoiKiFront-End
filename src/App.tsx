import { Outlet, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { routers } from './routes/router';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { QueryParamProvider } from 'use-query-params';

function App() {
    const user = useSelector((state: RootState) => state.user);
    return (
        <div>
            <RouterProvider router={routers} />;
        </div>
    );
}
export default App;
