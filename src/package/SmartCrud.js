import React from 'react'
import { Provider } from 'react-redux'
import Rtl from './Components/Rtl'
import store from './Redux/store'
import SmartCrudBase from './SmartCrudBase'

function SmartCrud(props) {
    return (
        <Provider store={store}>
            <Rtl>
                <SmartCrudBase {...props} />
            </Rtl>
        </Provider>
    )
}

export default SmartCrud
