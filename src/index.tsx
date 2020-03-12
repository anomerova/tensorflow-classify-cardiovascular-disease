import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import reducers from './reducers'

import App from './AppLayout'
import './index.css'

const store = createStore(reducers as any);

ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, 
    document.getElementById('root')
);
