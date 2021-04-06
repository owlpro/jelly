import React from 'react'
import { Provider } from 'react-redux'
import { RTL } from './Components/Rtl'
import store from './Redux/store'
import SmartCrudBase from './SmartCrudBase'

export default function (props) {
    return (
        <Provider store={store}>
            <RTL>
                <SmartCrudBase {...props} />
            </RTL>
        </Provider>
    )
}
