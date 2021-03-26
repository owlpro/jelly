import React, { Component, Fragment } from 'react'
import { Provider } from 'react-redux'
import store from './Redux/store'
import Media from './Media'
class SmartCrudProvider extends Component {
    renderMediaModel = () => {
        return <Media />
    }
    render() {
        return (
            <Fragment>
                <Provider store={store}>
                    {this.renderMediaModel()}
                    {this.props.children}
                </Provider>
            </Fragment>
        )
    }
}
export default SmartCrudProvider
