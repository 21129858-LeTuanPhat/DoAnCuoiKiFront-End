import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SocketWrap from './socket/SocketWrap';
import store from '../src/redux/store';
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // <React.StrictMode>
    // <SocketWrap>
    <Provider store={store} > <App /></Provider>

    // </SocketWrap>,
    // </React.StrictMode>,
);
reportWebVitals();
