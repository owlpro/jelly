import React, { Fragment } from 'react'
import Dependencies from './Dependencies'
import { store_configs } from './Redux/action'
import store from './Redux/store'

import { RTL } from './Components/Rtl'
import './Assets/scss/styleLoader.scss'

class SmartCrudProvider extends React.Component {
    UNSAFE_componentWillMount() {
        let propsData = { ...this.props }
        delete propsData.children
        store.dispatch(store_configs(propsData))
        document.head.innerHTML = '<!-- jss-insertion-point -->' + document.head.innerHTML
    }

    render() {
        return (
            <Fragment>
                <RTL>
                    <Dependencies />
                </RTL>
                {this.props.children}
            </Fragment>
        )
    }
}

export default SmartCrudProvider
