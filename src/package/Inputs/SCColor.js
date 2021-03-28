import React, { Component } from "react";
import PropTypes from 'prop-types';

import { BlockPicker } from 'react-color';
import { Grid, TextField } from "@material-ui/core";
import * as $ from "jquery";

class SCColor extends Component {

    state = {
        ...this.props,
        value: '',
        selecting: false,
        error: false,
    }

    componentDidMount() {
        if (this.props.value) {
            this.setValue(this.props.value);
        }

        const self = this;

        $(document).off('click').on('click', function () {
            self.setColorPickerTo(false)();
        });

        $(".sc_color_picker, .select_color_textfield").off('click').on('click', function (e) {
            e.stopPropagation();
        });

        $(".sc_color_picker span > div").off('click').on('click', function () {
            let value = $(this).attr('title');
            self.setValue(value);
        });
        $(".sc_color_picker input").off('keyup').on('keyup', function (e) {
            if (e.keyCode === 13) self.setColorPickerTo(false)()
        });
    }

    componentWillUnmount() {
        $(document).off('click');
        $(".sc_color_picker, .select_color_textfield").off('click');
        $(".sc_color_picker span > div").off('click');
        $(".sc_color_picker input").off('keyup');
    }

    setValue = (value) => {
        this.setState(state => {
            const ns = { ...state };
            ns.value = value;
            return ns;
        })
    }

    getValue = () => {
        return this.state.value ? this.state.value : null;
    }

    clear = () => {
        this.setValue('');
    }

    onChange = value => {
        this.setValue(value.hex ? value.hex.toUpperCase() : '')
    }

    setColorPickerTo = to => () => {
        this.setState(state => {
            const ns = { ...state };
            ns.selecting = to;
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
        this.setColorPickerTo(true)();
        this.setStateItem('error', false);
    }

    render() {
        return (
            <React.Fragment>
                <Grid item xs={this.state.col} className="sc_color_picker_wrapper">
                    <TextField
                        fullWidth
                        type="text"
                        className={'select_color_textfield'}
                        margin={'dense'}
                        value={this.state.value.replace('#', '')}
                        label={this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                        name={this.state.selector}
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        error={this.state.error}
                        InputLabelProps={{
                            shrink: this.state.selecting || this.state.value ? true : false
                        }}
                        InputProps={{
                            className: "text-align-left",
                            endAdornment: this.state.value ? <span className="sc_selected_color_preview_endAdornment">#</span> : null,
                            startAdornment: this.state.value ? <span
                                onClick={this.setColorPickerTo(true)}
                                className="sc_selected_color_preview_startAdornment"
                                style={{ backgroundColor: this.state.value }} /> : null,
                            error: this.state.error,
                        }}
                    />
                    <BlockPicker
                        className={!this.state.selecting ? 'hide sc_color_picker' : 'sc_color_picker'}
                        color={this.state.value}
                        colors={['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8']}
                        value={this.state.value}
                        onChangeComplete={this.onChange}
                    />
                </Grid>
            </React.Fragment>
        )
    }
}
SCColor.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.array,
    col: PropTypes.number.isRequired
};

export default SCColor;