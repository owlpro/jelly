import React, { Component } from "react";
import PropTypes from 'prop-types';

import { TextField } from "@material-ui/core";
import { e2p, Number33, p2e } from "../Helpers/general";
import { Col } from "react-bootstrap";

class SCNumber extends Component {

    state = {
        ...this.props,
        value: '',
        error: false,
    }

    componentDidMount() {
        if (this.props.value || this.props.value === 0) {
            this.setValue(this.props.value);
        }
    }

    setValue = value => {
        value = value || value === 0 ? Number33(value) : '';

        this.setState(state => {
            const ns = { ...state };
            ns.value = value;
            return ns;
        })
    }

    getValue = () => {
        let value = this.state.value;
        value = value.toString().replace(/[^0-9]/g, '');
        return value ? parseInt(value) : '';
    }

    clear = () => {
        this.setValue('');
    }

    onChange = element => {
        let value = element.target.value;

        // Convert Persian Digits To English Ditits
        value = value ? p2e(value) : "";

        value = value.replace(/[^0-9]/g, '');
        value = value ? Number33(value) : "";
        
        if(this.props.format && typeof this.props.format === "function"){
            value = this.props.format(value)
        }
        this.setValue(value);
    }

    setStateItem = (key, value) => {
        this.setState(state => {
            let ns = { ...state };
            ns[key] = value;
            return ns;
        })
    }

    validationError = () => {
        clearTimeout(this.errorTimeout);

        this.setStateItem('error', true);
        this.errorTimeout = setTimeout(() => {
            this.setStateItem('error', false);
        }, 3000)
    }

    onFocus = () => {
        this.setStateItem('error', false);
    }

    render() {
        return (
            <React.Fragment>
                <Col xs={this.state.col}>
                    <TextField
                        fullWidth
                        type="text"
                        margin="dense"
                        error={this.state.error}
                        onFocus={this.onFocus}
                        InputProps={{
                            error: this.state.error
                        }}
                        value={this.state.value}
                        label={this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                        name={this.state.selector}
                        onChange={this.onChange}
                    />
                </Col>
            </React.Fragment>
        )
    }
}
SCNumber.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired
};

export default SCNumber;