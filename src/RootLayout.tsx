
import { Outlet, useNavigate } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';


export default function RootLayout() {


    return (
        <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Outlet />
        </QueryParamProvider>
    );
}
