import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { SmartCrudProvider } from './module'
import axios from './axios'
import './index.scss'

ReactDOM.render(
    <SmartCrudProvider axios={axios}>
        <App />
    </SmartCrudProvider>,
    document.getElementById('root')
)
