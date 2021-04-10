import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { SmartCrudProvider } from './module'
import axios from './axios'
import './index.scss'
import { createMuiTheme } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    input: {
        height: 38,
        fontSize: 14,
    },
    button: {
        height: 38,
    },
    direction: 'rtl',
    typography: {
        fontFamily: "vazir",
        fontSize: 14,
    },
})

ReactDOM.render(
    <SmartCrudProvider axios={axios} theme={theme}>
        <App />
    </SmartCrudProvider>,
    document.getElementById('root')
)
