import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SocketWrap from './socket/SocketWrap';

import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BoardProvider } from './components/chat/Context/BoardProvider';
import { Provider } from 'react-redux';
import store from './redux/store';
import { QueryParamProvider } from 'use-query-params';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // <React.StrictMode>
    <BoardProvider>
        {/* <SocketWrap> */}


        <Provider store={store}>
            <App /></Provider>
        {/* </SocketWrap> */}
    </BoardProvider>,
    // </React.StrictMode>,
);
reportWebVitals();
