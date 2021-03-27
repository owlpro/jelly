import React, { Fragment } from 'react'
// import { Provider } from 'react-redux'
// import store from './Redux/store'
// import Media from './Media/index'

export default function (props) {
    return (
        <Fragment>
            this is package
            {/* <Provider store={store}> */}
            {/* <Media /> */}
            {props.children}
            {/* </Provider> */}
        </Fragment>
    )
}
