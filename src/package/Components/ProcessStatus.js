import React, { Component } from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check'
import WarningIcon from '@material-ui/icons/Warning'
import './../Assets/scss/process_status.scss'
class ProcessStatus extends Component {
    state = {
        show: false,
    }

    timeout

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ show: true })
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.setState({ show: false })
        }, 3000)
    }

    render() {
        console.log(this.props)
        let status = ''
        switch (this.props.status) {
            case 'success':
                status = (
                    <span className="sc_psc_s_success">
                        <CheckIcon fontSize="small" />
                    </span>
                )
                break
            case 'failed':
                status = (
                    <span className="sc_psc_s_failed">
                        <CloseIcon fontSize="small" />
                    </span>
                )
                break
            case 'warning':
                status = (
                    <span className="sc_psc_s_warning">
                        <WarningIcon fontSize="small" />
                    </span>
                )
                break
            default:
                status = ''
                break
        }
        if (!this.state.show) return null
        return (
            <div className="sc_process_status_wrapper">
                {this.props.loading ? (
                    <span className="sc_process_status_loader">
                        <CircularProgress size={18} color="primary" />
                    </span>
                ) : null}
                <span className="sc_process_status_state">{status}</span>
                <div className="sc_process_status_contents">
                    <span className="sc_psc_message">{this.props.message}</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loading: state.smartcrud.process_status.loading,
    status: state.smartcrud.process_status.status,
    message: state.smartcrud.process_status.message,
})

export default connect(mapStateToProps)(ProcessStatus)
