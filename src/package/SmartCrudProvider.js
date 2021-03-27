import React, { Fragment } from 'react'
import './Assets/scss/styles.scss'
import Media from './Media/index'

export default function (props) {
    return (
        <Fragment>
            <Media />
            {props.children}
        </Fragment>
    )
}
