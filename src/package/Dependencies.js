import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Media from './Media'
import store from './Redux/store'
import AlertDialog from './Components/AlertDialog'
import Rtl from './Components/Rtl'

export default class Dependencies extends Component {
    render() {
        return (
            <Provider store={store}>
                <Rtl>
                    <Media />
                    <AlertDialog />
                </Rtl>
            </Provider>
        )
    }
}
