import React, { Fragment } from 'react'
import Dependencies from './Dependencies'
import { store_configs } from './Redux/action'
import store from './Redux/store'
import PropTypes from 'prop-types'

import { RTL } from './Components/Rtl'
import './Assets/scss/styleLoader.scss'

class SmartCrudProvider extends React.Component {
    static propTypes = {
        axios: PropTypes.object.isRequired,
    }

    UNSAFE_componentWillMount() {
        document.head.innerHTML = '<!-- jss-insertion-point -->' + document.head.innerHTML

        let propsData = { ...this.props }
        delete propsData.children
        store.dispatch(store_configs(propsData))
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
