import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { SmartCrudProvider } from './module'
import ReactDataTableComponent from 'react-data-table-component'
import axios from './axios'

ReactDOM.render(
    <SmartCrudProvider datatable={ReactDataTableComponent} axios={axios}>
        <App />
    </SmartCrudProvider>,
    document.getElementById('root')
)
