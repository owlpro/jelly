import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'

import { Box, Button, Tab, Tabs } from '@material-ui/core'

import SCText from './Inputs/SCText'
import SCTextarea from './Inputs/SCTextarea'
import SCNumber from './Inputs/SCNumber'
import SCSelect from './Inputs/SCSelect'
import SCMultiselect from './Inputs/SCMultiselect'
import SCColor from './Inputs/SCColor'
import SCRadio from './Inputs/SCRadio'
import SCPassword from './Inputs/SCPassword'
import SCBirthday from './Inputs/SCBirthday'
import SCMap from './Inputs/SCMap'

import { Col, Modal, Row } from 'react-bootstrap'
import SmartCrudDataTable from './DataTable/SmartCrudDataTable'
import { TabPanel } from './Helpers/TabPanel'
import HasMany from './Relations/HasMany'
import HasOne from './Relations/HasOne'
import { Dialog } from './Helpers/general'
import { deleteItem, editItem, createItem } from './Redux/action'
import { DangerAlert, SuccessAlert, WarningAlert } from './Helpers/alert'
import { select, setToObject } from './Helpers/general'
import SCImage from './Inputs/SCImage'
import SCIncrements from './Inputs/SCIncrements'

class SmartCrudBase extends Component {
    state = {
        ...this.props,
        _tab: 0,
        edit: {
            show: false,
            data: null,
        },
    }

    relations = {}

    makeRenderableInputs = (defaultData = null) => {
        if (!this.props.inputs) return null
        return this.props.inputs.map((item, loopKey) => {
            let input = { ...item }
            let selector = input.selector.split(':')[0]
            let value = defaultData ? select(selector, defaultData) : null

            // check input is editable or not
            if (value && input.editable === false) return null

            input['value'] = value

            switch (input.type) {
                case 'text':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCText ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'textarea':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCTextarea ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'number':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCNumber ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'select':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCSelect ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'multiselect':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCMultiselect ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'color':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCColor ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'radio':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCRadio ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'password':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCPassword ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'birthday':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCBirthday ref={(el) => (this[input.selector] = el)} {...input} />
                        </React.Fragment>
                    )
                case 'map':
                    return (
                        <React.Fragment key={loopKey}>
                            <SCMap ref={(el) => (this[input.selector] = el)} {...input} />
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

    renderDataTable = () => {
        return <SmartCrudDataTable {...this.props} onEdit={this.onEdit} onDelete={this.onDelete} ref={(ref) => (this.datatableRef = ref)} />
    }

    renderCreateSection = () => {
        this.relations.hasOne = []
        this.relations.hasMany = []

        return (
            <Box p={3} className="smartcrud_create_section_wrapper" style={{ backgroundColor: 'white' }}>
                <Row>
                    {this.makeRenderableInputs()}
                    <Col xs={12}>
                        {this.props.hasOne
                            ? this.props.hasOne.map((relation, rel_index) => (
                                  <HasOne key={rel_index} index={rel_index} {...relation} ref={(el) => (this.relations.hasOne[rel_index] = el)} />
                              ))
                            : null}
                    </Col>
                    <Col xs={12}>
                        {this.props.hasMany
                            ? this.props.hasMany.map((relation, rel_index) => (
                                  <HasMany key={rel_index} index={rel_index} {...relation} ref={(el) => (this.relations.hasMany[rel_index] = el)} />
                              ))
                            : null}
                    </Col>
                    <Col xs={12}>
                        <Button onClick={this.onSubmit} variant={'contained'} className="ml-2 shadow-0" color={'primary'}>
                            ارسال
                        </Button>
                        <Button onClick={this.onClear} variant={'contained'} className="shadow-0">
                            پاک کردن
                        </Button>
                    </Col>
                </Row>
            </Box>
        )
    }

    renderEditContent = (params) => {
        this.relations.hasOne = []
        this.relations.hasMany = []

        return (
            <Box p={1}>
                <Row>
                    {this.makeRenderableInputs(params.data)}
                    <Col xs={12}>
                        {this.props.hasOne
                            ? this.props.hasOne.map((relation, rel_index) => {
                                  let relationClone = { ...relation }
                                  let selector = relation.relation.split(':')[0]
                                  let value = params.data ? params.data[selector] : null
                                  relationClone['value'] = value

                                  return (
                                      <HasOne
                                          {...this.props}
                                          row={this.state.edit.data}
                                          key={rel_index}
                                          index={rel_index}
                                          {...relationClone}
                                          ref={(el) => (this.relations.hasOne[rel_index] = el)}
                                      />
                                  )
                              })
                            : null}
                    </Col>
                    <Col xs={12}>
                        {this.props.hasMany
                            ? this.props.hasMany.map((relation, rel_index) => {
                                  let relationClone = { ...relation }
                                  let selector = relation.relation.split(':')[0]
                                  let value = params.data ? params.data[selector] : null
                                  relationClone['value'] = value

                                  return (
                                      <HasMany
                                          {...this.props}
                                          row={this.state.edit.data}
                                          key={rel_index}
                                          index={rel_index}
                                          {...relationClone}
                                          ref={(el) => (this.relations.hasMany[rel_index] = el)}
                                      />
                                  )
                              })
                            : null}
                    </Col>
                </Row>
            </Box>
        )
    }

    renderEditModal = () => {
        return (
            <Modal size="xl" show={this.state.edit.show} onHide={this.setEditModalTo(false)}>
                <Modal.Header>
                    <Modal.Title>
                        <span>ویرایش</span>
                        &nbsp;
                        <span>{this.state.edit.data ? this.state.edit.data.title || this.state.edit.data.subtitle : null}</span>
                        {/* {this.state.edit.data && this.state.edit.data.name ? <Fragment>&nbsp;-&nbsp;<span>(&nbsp;{this.state.edit.data.name}&nbsp;)</span></Fragment> : null} */}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="settlementWithmerchantModal">
                    <Box p={3}>{this.renderEditContent(this.state.edit)}</Box>
                </Modal.Body>

                <Modal.Footer className="justify-content-center">
                    <Button variant="contained" className="shadow-0" color="primary" onClick={this.onSubmitEdit}>
                        ذخیره
                    </Button>
                    <Button variant="contained" className="mr-2 shadow-0" color="default" onClick={this.setEditModalTo(false)}>
                        بستن
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    exportData = () => {
        let filledInputs = true

        let values = this.state.inputs.map((item) => {
            let input = this[item.selector]

            let value = input ? input.getValue() : null

            if (input && item.isRequired && ((value !== null && typeof value === 'object' && Object.keys(value).length < 1) || (value !== 0 && !value))) {
                filledInputs = false
                input.validationError()
            }

            if (this.state.edit.data) {
                // if is edit mode and is editable
                if (item.editable) {
                    return {
                        selector: item.selector,
                        value: value,
                    }
                }
            } else {
                return {
                    selector: item.selector,
                    value: value,
                }
            }
        })

        let outputData = {}

        values = values.filter((item) => typeof item !== 'undefined')

        values.forEach((item) => {
            setToObject(item.selector, item.value, outputData)
        })

        this.relations.hasOne.forEach((hasOneRelation) => {
            let exported = hasOneRelation.getValues()

            if (!exported.filled) {
                filledInputs = false
            }
            let value = exported.data
            let outputValues = {}
            value.forEach((item) => {
                setToObject(item.selector, item.value, outputValues)
                outputValues[item.selector] = item.value
            })
            outputData[hasOneRelation.props.relation] = outputValues
        })

        this.relations.hasMany.forEach((hasManyRelation) => {
            let exported = hasManyRelation.getValues()
            if (!exported.filled) {
                filledInputs = false
            }
            let value = exported.data
            let outputValues = []

            value.forEach((item, index) => {
                outputValues[index] = {}
                item.forEach((val_item) => {
                    if (val_item.hasOwnProperty('id')) {
                        outputValues[index]['id'] = val_item.id
                    }
                    setToObject(val_item.selector, val_item.value, outputValues[index])
                })
            })

            outputData[hasManyRelation.props.relation] = outputValues
        })

        if (this.state.edit.data) {
            outputData = { ...outputData, id: this.state.edit.data.id }
            for (let selector in outputData) {
                let item = outputData[selector]
                if (item && typeof item === 'object' && !Array.isArray(item)) {
                    let existsData = this.state.edit.data[selector]
                    if (existsData && typeof existsData === 'object' && !Array.isArray(existsData) && existsData.id) {
                        outputData[selector].id = existsData.id
                    }
                }
            }
        }

        if (this.props.appendDataToRequest) {
            outputData = { ...outputData, ...this.props.appendDataToRequest }
        }

        return {
            filled: filledInputs,
            data: outputData,
        }
    }

    onSubmit = () => {
        let exported = this.exportData()
        if (!exported.filled) {
            return WarningAlert('اخطار', 'پرکردن فیلد های ستاره دار اجباری می باشد')
        }
        let data = { ...exported.data }

        if (this.props.mutators && this.props.mutators.onSubmit && typeof this.props.mutators.onSubmit === 'function') {
            data = this.props.mutators.onSubmit(data)
        }

        if (this.props.debug) {
            return console.log(data)
        }

        this.props
            .createItem(
                {
                    route: this.props.route,
                },
                data
            )
            .then((response) => {
                console.log(response)
                this.setEditModalTo(false)()
                SuccessAlert('ایجاد', 'ایجاد با موفقیت انجام گردید')
                this.onClear()
            })
            .catch((error) => {
                console.log(error.response)
                DangerAlert('ایجاد', 'ایجاد با شکست مواجه شد')
            })
    }

    onClear = () => {
        this.state.inputs.forEach((item) => {
            this[item.selector].clear()
        })

        this.relations.hasOne.forEach((hasOneRelation) => {
            hasOneRelation.clear()
        })

        this.relations.hasMany.map((hasManyRelation) => {
            hasManyRelation.clear()
        })
    }

    onChangeTab = (_, activeTab) => {
        this.setState((state) => {
            let ns = { ...state }
            ns._tab = activeTab
            return ns
        })
    }

    setEditModalTo = (to, data = null) => () => {
        this.setState((state) => {
            let ns = { ...state }
            ns.edit.show = to
            if (data) {
                ns.edit.data = data
            }
            return ns
        })

        if (data === null) {
            setTimeout(() => {
                this.setState((state) => {
                    let ns = { ...state }
                    ns.edit.data = null
                    return ns
                })
            }, 500)
        }
    }

    onEdit = (row) => {
        let data = { ...row }
        if (this.props.mutators && this.props.mutators.onEdit && typeof this.props.mutators.onEdit === 'function') {
            data = this.props.mutators.onEdit(data)
        }

        this.setEditModalTo(true, data)()
    }

    onSubmitEdit = () => {
        let exported = this.exportData()
        if (!exported.filled) {
            return WarningAlert('اخطار', 'پرکردن فیلد های ستاره دار اجباری می باشد')
        }
        let data = { ...exported.data }

        if (this.props.mutators && this.props.mutators.onSubmitEdit && typeof this.props.mutators.onSubmitEdit === 'function') {
            data = this.props.mutators.onSubmitEdit(data)
        }

        if (this.props.debug) {
            return console.log(data)
        }

        this.props
            .editItem(
                {
                    route: this.props.route,
                },
                data
            )
            .then((response) => {
                console.log(response)
                this.setEditModalTo(false)()
                SuccessAlert('ویرایش', 'ویرایش با موفقیت انجام گردید')
                this.datatableRef.stableRefresh()
            })
            .catch((error) => {
                console.log(error.response)
                DangerAlert('ویرایش', 'ویرایش با شکست مواجه شد')
            })
    }

    onDelete = (row) => {
        Dialog({
            title: 'حذف',
            description: (
                <div>
                    <p>
                        از حذف <b>{row.title || row.subtitle}</b> اطمینان دارید ؟
                    </p>
                </div>
            ),
            yes: 'تایید و حذف',
            onAccept: () => {
                this.props
                    .deleteItem(
                        {
                            route: this.props.route,
                        },
                        row
                    )
                    .then(() => {
                        this.datatableRef.stableRefresh()
                        SuccessAlert('حذف ' + (row.title || row.subtitle), 'عملیات حذف با موفقیت انجام گردید')
                    })
                    .catch(() => {
                        DangerAlert('حذف ' + (row.title || row.subtitle), 'عملیات حذف با شکست مواجه شد')
                    })
            },
        })
    }

    render() {
        return (
            <div className="smartcrud_wrapper">
                <div className="smartcrud_tabs_wrapper">
                    <Tabs value={this.state._tab} onChange={this.onChangeTab} aria-label="simple tabs example">
                        <Tab
                            label={
                                <div className="d-flex align-items-center">
                                    <span>{this.props.title || 'لیست اطلاعات'}</span>
                                    <i className="feather icon-list mr-2 text-primary"></i>
                                </div>
                            }
                        />
                        {this.state.inputs ? (
                            <Tab
                                label={
                                    <div className="d-flex align-items-center">
                                        <span>ایجاد</span>
                                        <i className="feather icon-plus mr-2 text-primary"></i>
                                    </div>
                                }
                            />
                        ) : null}
                    </Tabs>
                </div>

                <TabPanel value={this.state._tab} index={0}>
                    {this.renderDataTable()}
                    {this.renderEditModal()}
                </TabPanel>
                {this.props.inputs ? (
                    <TabPanel value={this.state._tab} index={1}>
                        {this.renderCreateSection()}
                    </TabPanel>
                ) : null}
            </div>
        )
    }
}
SmartCrudBase.propTypes = {
    inputs: PropTypes.array,
    hasMany: PropTypes.array,
    hasOne: PropTypes.array,

    route: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    filters: PropTypes.array.isRequired,
    relations: PropTypes.array,
    appendFilter: PropTypes.array,
    moreItems: PropTypes.func,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
    createItem: (request, data) => dispatch(createItem(request, data)),
    editItem: (request, data) => dispatch(editItem(request, data)),
    deleteItem: (request, data) => dispatch(deleteItem(request, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SmartCrudBase)