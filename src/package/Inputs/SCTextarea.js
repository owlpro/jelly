import React, { Component } from "react";
import PropTypes from 'prop-types';

import { Grid, TextField } from "@material-ui/core";
import { p2e } from "../Helpers/general";

class SCTextarea extends Component {

    state = {
        ...this.props,
        value: '',
        error: false,
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
                <Grid item xs={this.state.col}>
                    <TextField
                        fullWidth
                        multiline
                        type="text"
                        margin="dense"
                        error={this.state.error}
                        onFocus={this.onFocus}
                        value={this.state.value}
                        label={this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                        name={this.props.selector}
                        onChange={this.onChange}
                    />
                </Grid>
            </React.Fragment>
        )
    }
}
SCTextarea.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired
};

export default SCTextarea;