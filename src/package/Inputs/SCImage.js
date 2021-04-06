import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'
import { p2e } from '../Helpers/general'
import { set_media_modal_show_to } from '../Redux/action'
import { Fragment } from 'react'
import FileFormat from '../Media/FileFormat'

class SCImage extends Component {
    state = {
        ...this.props,
        value: '',
        error: false,
        file: null,
    }

    componentDidMount() {
        if (this.props.value) {
            let value = this.props.value[0]
            this.setValue(value)
        }
    }

    setStateItem = (key, value) => {
        this.setState((state) => {
            let ns = { ...state }
            ns[key] = value
            return ns
        })
    }

    setValue = (value) => {
        this.setState((state) => {
            let ns = { ...state }
            ns.file = value
            return ns
        })
    }

    getValue = () => {
        return this.state.file ? [{ media_id: this.state.file.id }] : null
    }

    clear = () => {
        this.setValue(null)
    }

    onChange = (element) => {
        let value = element.target.value
        value = p2e(value)
        this.setValue(value)
    }

    validationError = () => {
        clearTimeout(this.errorTimeout)

        this.setStateItem('error', true)
        this.errorTimeout = setTimeout(() => {
            this.setStateItem('error', false)
        }, 3000)
    }

    #openMedia = () => {
        this.setStateItem('error', false)
        this.setStateItem('file', null)
        this.props.set_media_modal_show_to(this.onMediaSelected)
    }

    onMediaSelected = (media) => {
        this.setStateItem('file', media)
    }

    #isImage = (item) => {
        let imageFormat = ['png', 'jpg', 'jpeg', 'svg', 'gif']
        return imageFormat.indexOf(item.format) > -1
    }

    render() {
        let baseUrl = this.props.axios.defaults.baseURL
        let child = this.state.file && this.#isImage(this.state.file) ? this.state.file.children[3] : null
        return (
            <React.Fragment>
                <Grid item xs={this.state.col}>
                    <div className="scimage_input_wrapper" onClick={this.#openMedia}>
                        {!this.state.file ? (
                            <Fragment>
                                <div className="scimage_input_wrapper_image_bg"></div>
                                <div className="scimage_input_contents">
                                    <i className={(this.state.error ? 'text-danger' : '') + ' feather icon-plus-square'}></i>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="scimage_input_image_data_wrapper">
                                    {this.#isImage(this.state.file) ? (
                                        <Fragment>
                                            <div className="scimage_input_image_selected_effect" style={{ backgroundImage: `url('${baseUrl + child.path}')` }}></div>
                                                <div className="scimage_input_image_selected_image">
                                                    <img src={baseUrl + child.path} />
                                                </div>
                                        </Fragment>
                                    ) : (
                                        <div className="scimage_input_file_data_wrapper">
                                            <FileFormat className="scimage_input_file_selected_file" format={this.state.file.format} />
                                            <span>{this.state.file.users[0].pivot.title}</span>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        )}
                    </div>
                </Grid>
            </React.Fragment>
        )
    }
}
SCImage.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => ({
    axios: state.smartcrud.config.axios,
})

const mapDispatchToProps = (dispatch) => ({
    set_media_modal_show_to: (callback) => dispatch(set_media_modal_show_to(true, 'single', callback)),
})

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(SCImage)
