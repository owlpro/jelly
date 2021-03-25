import React, { Component } from "react";
import PropTypes from 'prop-types';

import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Col } from "react-bootstrap";
import { p2e } from "../Helpers/general";
import { Visibility, VisibilityOff } from "@material-ui/icons";

class SCPassword extends Component {

    state = {
        ...this.props,
        value: '',
        showData: false,
    }

    componentDidMount() {
        if (this.props.value) {
            this.setValue(this.props.value);
        }
    }

    setValue = value => {
        this.setState(state => {
            const ns = { ...state };
            ns.value = value;
            return ns;
        })
    }

    getValue = () => {
        return this.state.value;
    }

    clear = () => {
        this.setValue('');
    }

    onChange = element => {
        let value = element.target.value;
        value = p2e(value);
        if(this.props.format && typeof this.props.format === "function"){
            value = this.props.format(value)
        }
        this.setValue(value)
    }

    toggleShowData = () => {
        this.setState(state => {
            const ns = { ...state };
            ns.showData = !ns.showData;
            return ns;
        })
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
                        type={this.state.showData ? 'text' : 'password'}
                        margin="dense"
                        value={this.state.value}
                        label={this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                        name={this.state.selector}
                        onChange={this.onChange}
                        error={this.state.error}
                        onFocus={this.onFocus}
                        autoComplete='new-password'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={this.toggleShowData}
                                    >
                                        {this.state.showData ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            form: {
                                autocomplete: 'off',
                            },

                        }}
                    />
                </Col>
            </React.Fragment>
        )
    }
}
SCPassword.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired
};

export default SCPassword;