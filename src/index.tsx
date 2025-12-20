import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SocketWrap from './socket/SocketWrap';

import { BoardProvider } from './components/chat/Context/BoardProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // <React.StrictMode>
    <BoardProvider>
        <SocketWrap>
            <App />
        </SocketWrap>
    </BoardProvider>,
    // </React.StrictMode>,
);
reportWebVitals();
