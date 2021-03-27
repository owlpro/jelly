import React from 'react'
import { Provider } from 'react-redux'
import store from '../Redux/store'
import MediaBase from './MediaBase'

export default function (props) {
    return (
        <Provider store={store}>
            <MediaBase {...props} />
        </Provider>
    )
}
