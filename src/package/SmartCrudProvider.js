import React, { Fragment } from 'react'
import Dependencies from './Dependencies'
import { store_configs } from './Redux/action'
import store from './Redux/store'

import './Assets/scss/styles.scss'

class SmartCrudProvider extends React.Component {
    componentDidMount() {
        let propsData = { ...this.props }
        delete propsData.children
        store.dispatch(store_configs(propsData))
    }

    render() {
        return (
            <Fragment>
                <Dependencies />
                {this.props.children}
            </Fragment>
        )
    }
}

export default SmartCrudProvider
