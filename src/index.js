import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { SmartCrudProvider } from './module'

ReactDOM.render(
    <SmartCrudProvider>
        <App />
    </SmartCrudProvider>,
    document.getElementById('root')
)
