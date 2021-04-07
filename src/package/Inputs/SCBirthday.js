import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import JalaliUtils from "@date-io/jalaali";
import moment from "moment";
import { Grid } from "@material-ui/core";

class SCBirthday extends Component {

    state = {
        ...this.props,
        value: null,
    }

    componentDidMount() {
        if (this.props.value) {
            this.setValue(this.props.value);
        }
    }

    setValue = value => {
        this.setState(state => {
            const ns = { ...state };
            ns.value = moment(value);
            return ns;
        });
    }

    getValue = () => {
        return this.state.value ? this.state.value.format('YYYY-MM-DD') : null;
    }

    clear = () => {
        this.setValue(null);
    }

    onChange = value => {
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
                    <MuiPickersUtilsProvider utils={JalaliUtils}>
                        <KeyboardDatePicker
                            fullWidth
                            variant="dialog"
                            format="jMMMM jDD"
                            margin="dense"
                            label={this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                            value={this.state.value}
                            onChange={this.onChange}
                            okLabel="تایید"
                            cancelLabel="بازگشت"
                            helperText=""
                            InputLabelProps={{
                                shrink: this.state.value ? true : false,
                            }}
                            error={this.state.error}
                            InputProps={{
                                error: this.state.error,
                                onFocus: this.onFocus
                            }}
                        />
                        {/* <TextField
                            fullWidth
                            type="date"
                            margin="dense"
                            value={this.state.value}
                            label={this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                            name={this.state.selector}
                            onChange={this.onChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        /> */}
                    </MuiPickersUtilsProvider>
                </Grid>
            </React.Fragment>
        )
    }
}
SCBirthday.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired
};

export default SCBirthday;