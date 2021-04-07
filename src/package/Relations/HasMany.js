import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import SCText from '../Inputs/SCText'
import SCTextarea from '../Inputs/SCTextarea'
import SCNumber from '../Inputs/SCNumber'
import SCSelect from '../Inputs/SCSelect'
import SCMultiselect from '../Inputs/SCMultiselect'
import SCColor from '../Inputs/SCColor'
import SCRadio from '../Inputs/SCRadio'
import SCPassword from '../Inputs/SCPassword'
import SCBirthday from '../Inputs/SCBirthday'
import SCMap from '../Inputs/SCMap'

import IconButton from '@material-ui/core/IconButton'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import { Dialog, RandomStr } from '../Helpers/general'
import { select } from '../Helpers/general'
import { DangerAlert, WarningAlert } from '../Helpers/alert'

import { deleteHasManyRelationItem } from '../Redux/action'
import SCImage from '../Inputs/SCImage'
import SCIncrements from '../Inputs/SCIncrements'
import { Grid } from '@material-ui/core'

class HasMany extends Component {
    state = {
        ...this.props,
        items: [],
    }

    elements = {}

    UNSAFE_componentWillMount() {
        this.setState((state) => {
            let ns = { ...state }
            ns.minItems = this.props.minItems || 1
            ns.maxItems = this.props.maxItems || 10
            return ns
        })
    }

    async componentDidMount() {
        if (this.props.value) {
            let items = this.props.value.map((item) => ({ ...item, __key__: this.makeKey() }))
            await this.setState((state) => {
                let ns = { ...state }
                ns.items = items
                return ns
            })

            this.state.items.forEach((item) => {
                let row = this.elements[item.__key__]
                this.state.inputs.forEach((input) => {
                    let selector = input.selector
                    let value = select(selector, item)
                    let element = row[selector]
                    element.setValue(value)
                })
            })
        } else {
            this.setState((state) => {
                let ns = { ...state }
                ns.items = Array.from(Array(ns.minItems).keys()).map(() => ({ __key__: this.makeKey() }))
                return ns
            })
        }
    }

    makeRenderableInputs(index) {
        if (!this.state.inputs) return null
        let key = index.__key__
        if (!this.elements[key]) this.elements[key] = {}

        return this.state.inputs.map((item, loopKey) => {
            let input = { ...item }

            // check input is editable or not
            if (this.props.value && input.editable === false) return null

            switch (input.type) {
                case 'text':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCText ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'textarea':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCTextarea ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'number':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCNumber ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'select':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCSelect ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'multiselect':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCMultiselect ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'color':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCColor ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'radio':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCRadio ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'password':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCPassword ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'birthday':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCBirthday ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'map':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCMap ref={(el) => (this.elements[key][input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'image':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCImage ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'increments':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCIncrements ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                default:
                    return console.error(input.type + ' is not a valid SMARTCRUD input')
            }
        })
    }

    makeKey = (length = 15) => {
        let key = RandomStr(length)
        if (this.state.items.filter((item) => item.__key__ === key).length > 0) {
            return this.makeKey(length)
        }
        return key
    }

    addItem = () => {
        let key = this.makeKey()

        if (this.state.items.length < this.state.maxItems) {
            this.setState((state) => {
                let ns = { ...state }
                ns.items.push({ __key__: key })
                return ns
            })
        }
    }

    softRemoveItem = async (index) => {
        await this.setState((state) => {
            let ns = { ...state }
            ns.items = ns.items.filter((item) => item.__key__ !== index.__key__)
            return ns
        })
        delete this.elements[index.__key__]
    }

    removeItem = (index) => () => {
        if (this.state.items.length > this.state.minItems) {
            if (index.id) {
                Dialog({
                    title: this.props.label,
                    description: (
                        <div>
                            <b>از حذف ایتم مورد نظر اطمینان دارید ؟</b>
                            <p>در صورت حذف،‌ قابل بازیابی نمی باشد</p>
                        </div>
                    ),
                    onAccept: () => {
                        let route = this.props.route + '/' + this.props.row.id + '/' + this.props.relation + '/' + index.id
                        let appendData = index.pivot ? { pivot: index.pivot } : null
                        this.props
                            .deleteHasManyRelationItem({ route }, appendData)
                            .then(() => {
                                this.softRemoveItem(index)
                            })
                            .catch(() => {
                                DangerAlert('حذف رابطه با خطا مواجه شد')
                            })
                    },
                })
            } else {
                this.softRemoveItem(index)
            }
        } else {
            WarningAlert(`حداقل تعداد ${this.props.label} باید ${this.state.minItems} عدد باشد`)
        }
    }

    renderItem(index) {
        if (index.__key__)
            return (
                <Fragment key={index.__key__}>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={1} className="sc_relation_has_many_remove_item_wrapper">
                            <IconButton className="mt-3" onClick={this.removeItem(index)}>
                                <DeleteRoundedIcon className="text-danger" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={11}>
                            <Grid container spacing={3}>{this.makeRenderableInputs(index)}</Grid>
                        </Grid>
                    </Grid>
                </Fragment>
            )
    }

    getValues = () => {
        let filledInputs = true

        let values = this.state.items.map((index) => {
            return this.state.inputs.map((item) => {
                let input = this.elements[index.__key__][item.selector]

                let value = input ? input.getValue() : null

                if (input && item.isRequired && ((value !== null && typeof value === 'object' && Object.keys(value).length < 1) || (value !== 0 && !value))) {
                    filledInputs = false
                    input.validationError()
                }

                let returnable = false

                if (this.props.value) {
                    // if is edit mode and is editable
                    if (item.editable) {
                        returnable = true
                    }
                } else {
                    returnable = true
                }

                if (returnable) {
                    let output = {
                        selector: item.selector,
                        value: value,
                    }
                    if (!output.hasOwnProperty('id') && typeof index.id === 'number') {
                        output.id = index.id
                    }
                    return output
                }
            })
        })

        values = values.filter((item) => typeof item !== 'undefined')
        return {
            filled: filledInputs,
            data: values,
        }
    }

    clear = () => {
        for (let elementSelector in this.elements) {
            let elementGroup = this.elements[elementSelector]
            for (let selector in elementGroup) {
                let element = elementGroup[selector]
                if (element) {
                    element.clear()
                }
            }
        }

        this.setState((state) => {
            let ns = { ...state }
            ns.items = Array.from(Array(ns.minItems).keys()).map(() => ({ __key__: this.makeKey() }))
            return ns
        })
    }

    render() {
        return (
            <Fragment>
                <div className="smartcrud_realtion_wrapper">
                    <div className="smartcrud_realtion_header">
                        <h4 className="text-right mb-0">{this.state.label}</h4>
                        <IconButton onClick={this.addItem}>
                            <AddRoundedIcon />
                        </IconButton>
                    </div>
                    <div className="smartcrud_relation_body">{this.state.items.map((item) => this.renderItem(item))}</div>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteHasManyRelationItem: (request, data) => dispatch(deleteHasManyRelationItem(request, data)),
})
export default connect(null, mapDispatchToProps, null, { forwardRef: true })(HasMany)
