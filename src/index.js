import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { SmartCrudProvider } from './module'
import ReactDataTableComponent from 'react-data-table-component'

ReactDOM.render(
    <SmartCrudProvider datatable={ReactDataTableComponent}>
        <App />
    </SmartCrudProvider>,
    document.getElementById('root')
)
