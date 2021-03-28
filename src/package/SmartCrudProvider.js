import React, { Fragment } from 'react'
import './Assets/scss/styles.scss'
import Media from './Media/index'

class SmartCrudProvider extends React.Component {
    render() {
        return (
            <Fragment>
                <Media />
                {this.props.children}
            </Fragment>
        )
    }
}

export default SmartCrudProvider
