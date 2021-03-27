import React from 'react'
import { Provider } from 'react-redux'
import store from './Redux/store'
import SmartCrudBase from './SmartCrudBase'

export default function (props) {
    return (
        <Provider store={store}>
            <SmartCrudBase {...props} />
        </Provider>
    )
}
