import React, { Fragment } from 'react'
import './Assets/scss/styles.scss'
import Media from './Media/index'

import { Box, Button, CircularProgress, IconButton, TextField } from '@material-ui/core'
import { Col, Modal, Row } from 'react-bootstrap'
import { FileDrop } from 'react-file-drop'
import { connect } from 'react-redux'
import { media_get_list, media_upload, set_media_modal_show_to } from './Redux/action'
import FileFormat from './Media/FileFormat'
import close from './Media/icon/close.svg'
import RefreshIcon from '@material-ui/icons/Refresh'
import ClearRoundedIcon from '@material-ui/icons/ClearRounded'
import { RandomStr, unique, humanFileSize } from './Helpers/general'
import { toJalaliDate } from './Helpers/general'
import { SuccessAlert } from './Helpers/alert'
import { Scrollbars } from 'react-custom-scrollbars'

class SmartCrudProvider extends React.Component {
    render() {
        return (
            <Fragment>
                <Media />
                {/* <Box>
                    <p>hereeeee</p>
                    <CircularProgress />
                    <h1>this is testing plugin for developing smart crud</h1>
                    <Button variant="contained">foooo</Button>
                </Box> */}

                {this.props.children}
            </Fragment>
        )
    }
}

export default SmartCrudProvider
