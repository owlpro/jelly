import React, { Component } from "react";
import PropTypes from 'prop-types';

import { Button, Grid } from "@material-ui/core";
import { p2e } from "../Helpers/general";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

class SCIncrements extends Component {

    state = {
        ...this.props,
        value: '',
        error: false
    }

    componentDidMount() {
        if (this.props.value) {
            this.setValue(this.props.value);
        }
    }

    setStateItem = (key, value) => {
        this.setState(state => {
            let ns = { ...state };
            ns[key] = value;
            return ns;
        })
    }

    setValue = value => {
        this.setState(state => {
            let ns = { ...state };
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
        if (this.props.format && typeof this.props.format === "function") {
            value = this.props.format(value)
        }

        this.setValue(value)
    }

    validationError = () => {
        clearTimeout(this.errorTimeout);

        this.setStateItem('error', true);
        this.errorTimeout = setTimeout(() => {
            this.setStateItem('error', false);
        }, 3000)
    }

    increment = () => {
        this.setStateItem('error', false);
        this.setStateItem('value', (this.state.value || 0) + 1);
    }
    decrement = () => {
        this.setStateItem('error', false);
        this.setStateItem('value', this.state.value - 1);
    }

    render() {
        return (
            <React.Fragment>
                <Grid item xs={this.state.col}>
                    <div className="sc_increments_input_wrapper">
                        <span className={(this.state.error ? "text-danger " : "") + "sc_increments_label"}>
                            {this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                        </span>
                        <div className="sc_increments_input_inner">
                            <Button variant="contained" color="primary" className="shadow-0" onClick={this.increment}>
                                <AddIcon />
                            </Button>
                            <span className="sc_increment_input_value">{this.state.value}</span>
                            <Button variant="contained" color="secondary" className="shadow-0" onClick={this.decrement}>
                                <RemoveIcon />
                            </Button>
                        </div>
                    </div>
                </Grid>
            </React.Fragment>
        )
    }
}
SCIncrements.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired
};

export default SCIncrements;