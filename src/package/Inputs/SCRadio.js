import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { Grid } from '@material-ui/core'

class SCRadio extends Component {
    state = {
        ...this.props,
        value: '',
    }

    setStateItem = (key, value) => {
        this.setState((state) => {
            let ns = { ...state }
            ns[key] = value
            return ns
        })
    }

    UNSAFE_componentWillMount() {
        if (this.props.value) {
            if (typeof this.props.value === 'object') {
                this.setValue(this.props.value.value)
            } else {
                this.setValue(this.props.value)
            }
        }
    }

    setValue = (value) => {
        this.setState((state) => {
            const ns = { ...state }
            ns.value = value
            return ns
        })
    }

    getValue = () => {
        return this.state.value
    }

    clear = () => {
        this.setValue('')
    }

    onChange = (_, value) => {
        this.setStateItem('error', false)
        this.setValue(value)
    }

    validationError = () => {
        clearTimeout(this.errorTimeout)

        this.setStateItem('error', true)
        this.errorTimeout = setTimeout(() => {
            this.setStateItem('error', false)
        }, 3000)
    }

    render() {
        return (
            <React.Fragment>
                <Grid item xs={this.state.col} className="d-flex align-items-end">
                    <div className={(this.state.error ? 'sm_radio_error ' : '') + 'sm_radio_label_wrapper'}>
                        <span className="m-0">
                            <React.Fragment>
                                {this.state.label} <span className="smart_crud_label_required">*</span>
                            </React.Fragment>
                        </span>
                    </div>
                    <ToggleButtonGroup
                        size="small"
                        className={(this.state.error ? 'sm_radio_error ' : 'sm_radio ') + 'w100 d-flex align-items-center justify-content-between'}
                        value={this.state.value}
                        exclusive
                        onChange={this.onChange}
                    >
                        {this.state.options.map((option, key) => (
                            <ToggleButton className="w100 smartcrud_togglable_button_item" key={key} value={option.value}>
                                {option.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Grid>
            </React.Fragment>
        )
    }
}
SCRadio.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
}

export default SCRadio
