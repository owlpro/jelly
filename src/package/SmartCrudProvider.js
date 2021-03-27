import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import store from './Redux/store'
import Media from './Media'

export default function (props) {
    return (
        <Fragment>
            <Provider store={store}>
                <Media />
                {props.children}
            </Provider>
        </Fragment>
    )
}
