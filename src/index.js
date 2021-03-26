import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as foo from './module.bundle'
import { SmartCrudProvider } from './module'

console.log(foo)
ReactDOM.render(
    // <React.StrictMode>
    <SmartCrudProvider>
        <App />
    </SmartCrudProvider>,
    // </React.StrictMode>,
    document.getElementById('root')
)
