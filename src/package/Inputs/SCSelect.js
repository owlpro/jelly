import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { DangerAlert } from '../Helpers/alert'
import { connect } from 'react-redux'

class SCSelect extends Component {
    state = {
        ...this.props,
        value: null,
        loading: false,
    }

    afterSyncOptions = () => {}

    UNSAFE_componentWillMount() {
        if (this.props.value) {
            this.afterSyncOptions = () => {
                const options = this.state.options.filter((item) => item.value === this.props.value)
                this.setValue(options[0])
            }
        }

        if (typeof this.state.options === 'string') {
            const getOptionsRoute = this.state.options
            this.setState((state) => {
                let ns = { ...state }
                ns.options = []
                ns.loading = true
                return ns
            })

            this.props.axios
                .get(getOptionsRoute)
                .then(async (response) => {
                    let data = [...response.data.results.data]
                    let options = await data.map((item) => {
                        if (this.props.hasOwnProperty('optionLabelSelector')) {
                            return { label: String(item[this.props.optionLabelSelector]), value: item.id }
                        }
                        return { label: item.title || item.subtitle, value: item.id }
                    })

                    options = options.filter((item) => item.label)

                    await this.setState((state) => {
                        let ns = { ...state }
                        ns.options = options
                        ns.loading = false
                        return ns
                    })

                    this.afterSyncOptions()
                })
                .catch((error) => {
                    this.setState((state) => {
                        let ns = { ...state }
                        ns.loading = false
                        return ns
                    })
                    DangerAlert(error.message)
                })
        } else {
            this.afterSyncOptions()
        }
    }

    setValue = (value) => {
        if (typeof value === 'object') {
            this.setState((state) => {
                const ns = { ...state }
                ns.value = value
                return ns
            })
        } else {
            if (this.state.options.length) {
                this.setState((state) => {
                    const ns = { ...state }
                    ns.value = this.state.options.filter((item) => item.value === value)[0]
                    return ns
                })
            } else {
                this.afterSyncOptions = () => {
                    const options = this.state.options.filter((item) => item.value === value)
                    this.setValue(options[0])
                }
            }
        }
    }

    getValue = () => {
        let selectedOption = this.state.value
        return selectedOption ? this.state.value.value : null
    }

    clear = () => {
        this.setValue(null)
    }

    onChange = (_, value) => {
        this.setValue(value)
    }

    setStateItem = (key, value) => {
        this.setState((state) => {
            let ns = { ...state }
            ns[key] = value
            return ns
        })
    }

    validationError = () => {
        clearTimeout(this.errorTimeout)

        this.setStateItem('error', true)
        this.errorTimeout = setTimeout(() => {
            this.setStateItem('error', false)
        }, 3000)
    }

    onFocus = () => {
        this.setStateItem('error', false)
    }

    render() {
        return (
            <React.Fragment>
                <Grid item xs={this.state.col}>
                    <Autocomplete
                        loading={this.state.loading}
                        loadingText={'درحال دریافت اطلاعات ...'}
                        margin="dense"
                        options={this.state.options}
                        getOptionLabel={(option) => (option ? option.label : '')}
                        onChange={this.onChange}
                        value={this.state.value}
                        clearOnEscape
                        className="sc_select_input_wrapper"
                        noOptionsText={'مورد مطابقی یافت نشد'}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={this.state.error}
                                onFocus={this.onFocus}
                                label={
                                    this.state.isRequired ? (
                                        <React.Fragment>
                                            {this.state.label} <span className="smart_crud_label_required">*</span>
                                        </React.Fragment>
                                    ) : (
                                        this.state.label
                                    )
                                }
                                margin="dense"
                            />
                        )}
                    />
                </Grid>
            </React.Fragment>
        )
    }
}
SCSelect.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    col: PropTypes.number.isRequired,
}
const mapStateToProps = (state) => ({
    axios: state.smartcrud.config.axios,
})

export default connect(mapStateToProps, null, null, { forwardRef: true })(SCSelect)
