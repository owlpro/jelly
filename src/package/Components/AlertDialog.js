import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { closeDialog, openDialog } from './../Redux/action'

class AlertDialog extends Component {
    handleClose = () => {
        this.props.close()
    }

    handleNo = (any) => {
        this.props.state.onDenied(any)
        this.handleClose()
    }

    handleYes = (any) => {
        this.props.state.onAccept(any)
        this.handleClose()
    }
    // MuiDialog-paperScrollPaper
    onBackdropClick = (e) => {
        let element = document.getElementsByClassName('MuiDialog-paperScrollPaper')[0]
        element.classList.remove('backDropClick')
        element.classList.add('backDropClick')
        setTimeout(() => {
            element.classList.remove('backDropClick')
        }, 400)
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.state.isOpen}
                    onClose={this.handleNo}
                    onBackdropClick={this.onBackdropClick}
                    disableBackdropClick
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.state.title}</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText id="alert-dialog-description" className="alert_dialog_content_text"> */}
                        {this.props.state.description}
                        {/* </DialogContentText> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleNo} className="shadow-0" variant="contained" color="default">
                            {this.props.state.no}
                        </Button>
                        <Button onClick={this.handleYes} className="ml-2 shadow-0" variant="contained" color="primary" autoFocus>
                            {this.props.state.yes}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const stateToProps = (state) => ({
    state: state.smartcrud.dialog,
})

const mapDispatchToProps = (dispatch) => ({
    close: () => dispatch(closeDialog()),
    open: (config) => dispatch(openDialog(config)),
})

export default connect(stateToProps, mapDispatchToProps)(AlertDialog)
