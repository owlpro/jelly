import React, { Component, Fragment } from "react";

import SCText from "../Inputs/SCText";
import SCTextarea from "../Inputs/SCTextarea";
import SCNumber from "../Inputs/SCNumber";
import SCSelect from "../Inputs/SCSelect";
import SCMultiselect from "../Inputs/SCMultiselect";
import SCColor from "../Inputs/SCColor";
import SCRadio from "../Inputs/SCRadio";
import SCPassword from "../Inputs/SCPassword";
import SCBirthday from "../Inputs/SCBirthday";
import SCMap from "../Inputs/SCMap";

import { Row } from "react-bootstrap";
import { select } from "../Helpers/general";
import SCImage from "../Inputs/SCImage";
import SCIncrements from "../Inputs/SCIncrements";

class HasOne extends Component {
    state = {
        ...this.props,
    }

    makeRenderableInputs = () => {
        if (!this.props.inputs) return null;
        return this.props.inputs.map((item, loopKey) => {
            let input = { ...item };

            let value;

            if (this.props.value) {
                value = select(input.selector, this.props.value)
                input['value'] = value || null;
            }

            // check input is editable or not
            if (value && input.editable === false) return null;

            switch (input.type) {
                case "text": return <React.Fragment key={loopKey}><SCText ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "textarea": return <React.Fragment key={loopKey}><SCTextarea ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "number": return <React.Fragment key={loopKey}><SCNumber ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "select": return <React.Fragment key={loopKey}><SCSelect ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "multiselect": return <React.Fragment key={loopKey}><SCMultiselect ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "color": return <React.Fragment key={loopKey}><SCColor ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "radio": return <React.Fragment key={loopKey}><SCRadio ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "password": return <React.Fragment key={loopKey}><SCPassword ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "birthday": return <React.Fragment key={loopKey}><SCBirthday ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "map": return <React.Fragment key={loopKey}><SCMap ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "image": return <React.Fragment key={loopKey}><SCImage ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                case "increments": return <React.Fragment key={loopKey}><SCIncrements ref={el => this[input.selector] = el} {...input} /></React.Fragment>;
                default: return console.error(input.type + " is not a valid SMARTCRUD input");
            }
        });
    }

    getValues = () => {
        let filledInputs = true;

        let values = this.props.inputs.map(item => {
            let input = this[item.selector];
            let value = input ? input.getValue() : null;
            if (input && item.isRequired && ((value !== null && typeof value === "object" && Object.keys(value).length < 1) || (value !== 0 && !value))) {
                filledInputs = false;
                input.validationError();
            }

            if (this.props.value) { // if is edit mode and is editable
                if (item.editable) {
                    return {
                        selector: item.selector,
                        value: value
                    }
                }
            } else {
                return {
                    selector: item.selector,
                    value: value
                }
            }
        });


        values = values.filter(item => typeof item !== "undefined");

        if (this.props.value) {
            values.push({
                selector: 'id',
                value: this.props.value.id
            })
        }

        return {
            filled: filledInputs,
            data: values
        };
    }

    clear = () => {
        this.props.inputs.forEach(item => {
            let element = this[item.selector];
            if (element) element.clear();
        });
    }

    render() {
        return (
            <Fragment>
                <div className="smartcrud_realtion_wrapper">
                    <div className="smartcrud_realtion_header">
                        <h4 className="text-right mb-0">{this.props.label}</h4>
                    </div>
                    <div className="smartcrud_relation_body">
                        <Row>
                            {this.makeRenderableInputs()}
                        </Row>
                    </div>
                </div>
            </Fragment>
        )

    }
}

export default HasOne;