import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { SmartCrudProvider } from './module'

ReactDOM.render(
    // <React.StrictMode>
    <SmartCrudProvider>
        <App />
    </SmartCrudProvider>,
    // </React.StrictMode>,
    document.getElementById('root')
)
