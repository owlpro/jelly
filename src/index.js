import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { SmartCrudProvider } from './module'
import ReactDataTable from 'react-data-table-component'

ReactDOM.render(
    <SmartCrudProvider datatable={ReactDataTable}>
        <App />
    </SmartCrudProvider>,
    document.getElementById('root')
)
