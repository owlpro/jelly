import { Button } from '@material-ui/core'
import React, { Fragment } from 'react'
import './Assets/scss/styles.scss'
// import Media from './Media/index'

export default function (props) {
    return (
        <Fragment>
            {/* <Media /> */}
            <h1>this is testing plugin for developing smart crud</h1>
            <Button variant="contained">foooo</Button>
            
            {props.children}
        </Fragment>
    )
}
