import React, { Component, Fragment } from 'react'
import { Box, Modal } from '@material-ui/core'
import { connect } from 'react-redux'
import { delete_morph, get_morph, post_morph } from '../../Redux/action'
import { FileDrop } from 'react-file-drop'

class Attachments extends Component {
    state = {
        show: false,
        request: {},
    }

    route = '/api/v4/tags'
    type_name = 'attachable_type'
    id_name = 'attachable_id'
    selector = 'src'

    #setStateItem = (key, value) => {
        this.setState((state) => {
            let ns = { ...state }
            ns[key] = value
            return ns
        })
    }

    #setShowTo = (to) => () => {
        this.#setStateItem('show', to)
    }

    open = (type, data) => {
        this.#setStateItem('request', {
            id_name: this.id_name,
            type_name: this.type_name,
            route: this.route,
            type: type,
        })
        this.#setShowTo(true)()
    }

    onTargetClick = () => {
        this.fileInputRef.click()
    }

    onFileInputChange = (event) => {
        const fileList = event.target.files
        this.onSelectFile(fileList)
    }

    onDrop = (fileList) => {
        this.onSelectFile(fileList)
    }

    onSelectFile = (fileList) => {
        console.log(fileList)
    }

    onDragOver = () => {
        console.log('onDragOver')
    }

    onDragLeave = () => {
        console.log('onDragLeave')
    }

    onFrameDrop = () => {
        console.log('onFrameDrop')
    }

    onFrameDragEnter = () => {
        console.log('onFrameDragEnter')
    }

    onFrameDragLeave = () => {
        console.log('onFrameDragLeave')
    }

    render() {
        return (
            <Fragment>
                <Modal className="sc-modal-wrapper" size="xl" open={this.state.show} onClose={this.#setShowTo(false)}>
                    <Box className="sc-modal-inner">
                        <div className="sc-modal-header">
                            <div className="sc-modal-title">مدیریت ضمیمه ها</div>
                        </div>
                        <div className="sc-modal-body">
                            <input multiple onChange={this.onFileInputChange} ref={(el) => (this.fileInputRef = el)} type="file" className="hide" />
                            <Box p={3}>
                                <FileDrop
                                    onDrop={this.onDrop}
                                    onDragOver={this.onDragOver}
                                    onDragLeave={this.onDragLeave}
                                    onTargetClick={this.onTargetClick}
                                    onFrameDrop={this.onFrameDrop}
                                    onFrameDragEnter={this.onFrameDragEnter}
                                    onFrameDragLeave={this.onFrameDragLeave}
                                >
                                    fooo
                                </FileDrop>
                            </Box>
                        </div>
                    </Box>
                </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    morph: state.smartcrud.morph,
})

const mapDispatchToProps = (dispatch) => ({
    get_morph: (request, data) => dispatch(get_morph(request, data)),
    post_morph: (request, data) => dispatch(post_morph(request, data)),
    // edit_morph: (request, data) => dispatch(edit_morph(request, data)),
    delete_morph: (request, data) => dispatch(delete_morph(request, data)),
})

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Attachments)
