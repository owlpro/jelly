import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { DangerAlert } from '../Helpers/alert'
import { connect } from 'react-redux'

class SCMultiSelect extends Component {
    state = {
        ...this.props,
        value: [],
        error: false,
    }

    afterSyncOptions = () => {}

    UNSAFE_componentWillMount() {
        if (this.props.value) {
            this.afterSyncOptions = () => {
                const options = this.props.value.map((item) => {
                    let baseOption = this.state.options.filter((op) => op.value === item.id)[0]
                    return {
                        label: baseOption ? baseOption.label : baseOption.title || baseOption.subtitle,
                        value: item.id,
                    }
                })
                this.setValue(options)
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
                    const options = response.data.results.data.map((item) => ({ label: item.title || item.subtitle, value: item.id }))

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
                    ns.value = this.state.options.filter((item) => item.value == value)[0]
                    return ns
                })
            } else {
                this.afterSyncOptions = () => {
                    this.setState((state) => {
                        const ns = { ...state }
                        ns.value = this.state.options.filter((item) => item.value == value)[0]
                        return ns
                    })
                }
            }
        }
    }

    getValue = () => {
        let selectedOption = this.state.value
        return selectedOption ? this.state.value.map((item) => ({ id: item.value })) : null
    }

    clear = () => {
        this.setValue([])
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
                        multiple
                        loading={this.state.loading}
                        loadingText={'درحال دریافت اطلاعات ...'}
                        margin="dense"
                        options={this.state.options}
                        getOptionLabel={(option) => (option ? option.label : '')}
                        onChange={this.onChange}
                        noOptionsText={'مورد مطابقی یافت نشد'}
                        value={this.state.value}
                        clearOnEscape
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
SCMultiSelect.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    col: PropTypes.number.isRequired,
}
const mapStateToProps = (state) => ({
    axios: state.smartcrud.config.axios,
})

export default connect(mapStateToProps, null, null, { forwardRef: true })(SCMultiSelect)
