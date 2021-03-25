import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// import { Provider } from 'react-redux'
// import store from './package/Redux/store'
// import SmartCrudProvider from './package/SmartCrudProvider'
ReactDOM.render(
    // <React.StrictMode>
    // <Provider store={store}>
        // <SmartCrudProvider>
            <App />,
        // </SmartCrudProvider>
    // </Provider>,
    // </React.StrictMode>,
    document.getElementById('root')
)
