import React, { Component, Fragment } from 'react'
import { Box, Button, CircularProgress, Grid, IconButton, Modal, TextField } from '@material-ui/core'
import { FileDrop } from 'react-file-drop'
import { connect } from 'react-redux'
import { media_get_list, media_upload, set_media_modal_show_to } from '../Redux/action'
import FileFormat from './FileFormat'
import close from './icon/close.svg'
import RefreshIcon from '@material-ui/icons/Refresh'
import ClearRoundedIcon from '@material-ui/icons/ClearRounded'
import { RandomStr, unique, humanFileSize } from '../Helpers/general'
import { toJalaliDate } from '../Helpers/general'
import { Scrollbars } from 'react-custom-scrollbars'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

class MediaBase extends Component {
    state = {
        show: true,
        sidebar_show: true,
        searchedMedia: [],
        inSearch: false,
        showUploading: true,
        uploadingItems: [],
        details: {
            show: false,
            data: null,
        },
        navbar_has_shadow: false,
    }

    componentDidMount() {
        let scope = localStorage.getItem('scope')
        if (scope) {
            this.props.getMediaList()
        }
    }

    #setStateItem = (key, value) => {
        this.setState((state) => {
            let ns = { ...state }
            ns[key] = value
            return ns
        })
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
        if (this.state.drop_status !== '') {
            this.#setStateItem('drop_status', '')
        }
    }

    makeKey = (length = 15) => {
        return RandomStr(length)
    }

    onSelectFile = (fileList) => {
        for (let i = 0; i < fileList.length; i++) {
            let file = fileList.item(i)
            let formData = new FormData()
            formData.append('file', file)
            let key = this.makeKey(20)

            this.props
                .uploadMedia(formData, {
                    onUploadProgress: (progressEvent) => this.onUploadProgress(key, progressEvent, file),
                })
                .then((response) => {
                    this.setState((state) => {
                        let ns = { ...state }
                        ns.uploadingItems.map((item) => {
                            if (item.key === key) {
                                item.event.status = 'success'
                            }
                            return null
                        })
                        return ns
                    })
                    let item = this.state.uploadingItems.filter((media) => media.key === key)[0]
                    this.finishUpload(item)
                })
                .catch((error) => {
                    this.setState((state) => {
                        let ns = { ...state }
                        ns.uploadingItems.map((item) => {
                            if (item.key === key) {
                                item.event.status = 'failed'
                            }
                            return null
                        })
                        return ns
                    })
                    let item = this.state.uploadingItems.filter((media) => media.key === key)[0]
                    this.finishUpload(item)
                })
        }
    }

    onUploadProgress = (key, event, file) => {
        let percentage = (event.loaded / event.total) * 100
        event.percentage = percentage
        event.status = event.loaded === event.total ? 'pendding' : 'uploading'

        this.setState((state) => {
            let ns = { ...state }
            let exists = ns.uploadingItems.filter((item) => item.key === key).length > 0
            if (exists) {
                ns.uploadingItems.forEach((item) => {
                    if (item.key === key) {
                        item.event = event
                    }
                })
            } else {
                ns.uploadingItems.unshift({
                    key,
                    event,
                    file,
                })
            }
            return ns
        })
    }

    onDragOver = () => {
        if (this.state.drop_status !== 'over') {
            this.#setStateItem('drop_status', 'over')
        }
    }

    onDragLeave = () => {
        if (this.state.drop_status !== 'frame') {
            this.#setStateItem('drop_status', 'frame')
        }
    }

    onFrameDrop = () => {
        if (this.state.drop_status !== '') {
            this.#setStateItem('drop_status', '')
        }
    }

    onFrameDragEnter = () => {
        if (this.state.drop_status !== 'frame') {
            this.#setStateItem('drop_status', 'frame')
        }
    }

    onFrameDragLeave = () => {
        if (this.state.drop_status !== null) {
            this.#setStateItem('drop_status', null)
        }
    }

    toggleSidebar = () => {
        this.#setStateItem('sidebar_show', !this.state.sidebar_show)
    }

    searchMedia = () => {
        let value = this.search.value
        if (value) {
            this.setState((state) => {
                let ns = { ...state }
                ns.searchedMedia = this.props.media.filter(
                    (item) => item.users[0].pivot.title.toLowerCase().indexOf(value.toLowerCase()) > -1 || ('.' + item.format).indexOf(value) > -1
                )
                ns.inSearch = true
                return ns
            })
            this.#setStateItem('inSearch', true)
        } else {
            this.#setStateItem('inSearch', false)
        }
    }

    resetSearch = () => {
        this.search.value = ''
        this.search.focus()
        this.#setStateItem('inSearch', false)
    }

    filterByCategory = (format) => () => {
        this.search.value = '.' + format
        this.searchMedia()
    }

    closeGeneralModal = () => {
        this.setState((state) => {
            state.details.show = false
            state.navbar_has_shadow = false
            state.inSearch = false
            return { ...state }
        })
        this.props.setMediaModalShowTo(false)
    }

    renderGeneralModal = () => {
        const mediaToShow = this.state.inSearch ? this.state.searchedMedia : this.props.media
        const allowFormats = this.props.media.map((item) => item.format)
        const formats = unique(allowFormats).sort()

        return (
            <Modal className="sc-modal-wrapper" size="xl" open={this.props.show} onClose={this.closeGeneralModal}>
                <Box className="sc-modal-inner sc-media-modal-inner">
                    <input multiple onChange={this.onFileInputChange} ref={(el) => (this.fileInputRef = el)} type="file" className="hide" />
                    {this.renderDetailsContents()}
                    <FileDrop
                        onDrop={this.onDrop}
                        onDragOver={this.onDragOver}
                        onDragLeave={this.onDragLeave}
                        onFrameDrop={this.onFrameDrop}
                        onFrameDragEnter={this.onFrameDragEnter}
                        onFrameDragLeave={this.onFrameDragLeave}
                        className="sm_media_file_drop"
                    >
                        <div className={'sm_file_frop_effect ' + this.state.drop_status}>
                            <CloudUploadIcon />
                        </div>
                        <Box p={2} className="pr-0">
                            <div className="sm_media_wrapper">
                                <div className={(this.state.sidebar_show ? 'sm_media_sidebar_show ' : 'sm_media_sidebar_hide ') + 'sm_media_sidebar'}>
                                    <div className="sm_media_type_categories_wrapper">
                                        {/* <span className="sm_media_type_categories_label">???????? ???????? ????</span> */}
                                        {/* <ReactScrollbar style={{width: 200, height: 300}}> */}
                                        <Scrollbars
                                            autoHide
                                            className="sm_media_sidebar_scrollbar"
                                            renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}
                                            renderTrackVertical={(props) => <div {...props} className="track-vertical" />}
                                        >
                                            <div className="sm_media_type_categories_inner">
                                                <Grid container className="sm_media_type_categories" spacing={2}>
                                                    {formats.length ? (
                                                        formats.map((format, key) => (
                                                            <Grid item xs={6} className="sm_media_type_category_wrapper" key={key}>
                                                                <Button
                                                                    onClick={this.filterByCategory(format)}
                                                                    variant="contained"
                                                                    color="default"
                                                                    className="sm_media_category_item shadow-0"
                                                                >
                                                                    <FileFormat format={format} className="sm_media_category_item_icon" />
                                                                </Button>
                                                            </Grid>
                                                        ))
                                                    ) : (
                                                        <div className="sm_media_type_categories_empty">
                                                            {/* <p>???????? ???????? ???????? ???? ???????? ?????????? ???????? ?????? ?????????? ?????????? ?????????? ????????????.</p> */}
                                                        </div>
                                                    )}
                                                </Grid>
                                            </div>
                                        </Scrollbars>
                                        {/* </ReactScrollbar> */}
                                        {/* <div className="sm_show_all_categories_wrapper">
                                            <Button variant="contained" color="default" className="shadow-0">?????????? ?????? ???????? ????</Button>
                                        </div> */}
                                    </div>

                                    <div className="sm_media_upload_button_wrapper">
                                        <Button variant="contained" color="primary" className="shadow-0 sm_media_upload_button" onClick={this.onTargetClick}>
                                            <span>?????????? ???????? ????????</span>
                                            <CloudUploadIcon />
                                        </Button>
                                    </div>
                                </div>

                                <div className={(this.state.sidebar_show ? 'sm_media_body_min ' : 'sm_media_body_full ') + 'sm_media_body'}>
                                    <div className={(this.state.navbar_has_shadow ? 'with_shadow ' : '') + 'sm_media_navbar'}>
                                        <div className="sm_media_navbar_right">
                                            <IconButton className="sm_toggle_sidebar_btn" onClick={this.toggleSidebar}>
                                                <img src={close} className="sm_toggle_sidebar_img" draggable={false} alt="" />
                                            </IconButton>
                                            <TextField
                                                inputRef={(el) => (this.search = el)}
                                                className="sm_media_search_input"
                                                margin="dense"
                                                variant="outlined"
                                                placeholder="????????????..."
                                                onChange={this.searchMedia}
                                                InputProps={{
                                                    endAdornment: this.state.inSearch ? (
                                                        <IconButton size={'small'} onClick={this.resetSearch}>
                                                            <ClearRoundedIcon />
                                                        </IconButton>
                                                    ) : null,
                                                }}
                                            />
                                        </div>
                                        <div className="sm_media_navbar_left"></div>
                                    </div>
                                    <Scrollbars
                                        autoHide
                                        className="sm_media_contents_scrollbar"
                                        // renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                                        // renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                                        // renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                                        renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}
                                        renderTrackVertical={(props) => <div {...props} className="track-vertical" />}
                                        onScroll={this.onScrollBody}
                                    >
                                        <div className="sm_media_contents">
                                            <div className="sm_media_contents_inner">
                                                <Grid container className="sm_media_item_wrapper" spacing={3}>
                                                    {mediaToShow.map((item) => this.renderMediaItem(item))}
                                                </Grid>

                                                {mediaToShow.length < 1 ? (
                                                    this.state.inSearch && !this.props.loading ? (
                                                        <div className="sm_media_message">
                                                            <span className="sm_media_msg_title">???????? ???????? ??????</span>
                                                            <IconButton onClick={this.resetSearch}>
                                                                <RefreshIcon />
                                                            </IconButton>
                                                        </div>
                                                    ) : this.props.loading ? (
                                                        <div className="sm_media_message search">
                                                            <span className="sm_media_msg_title">???? ?????? ???????????????? ?????????????? ...</span>
                                                            <CircularProgress className="sm_media_loading_circular" />
                                                        </div>
                                                    ) : (
                                                        <div className="sm_media_message">
                                                            <span className="sm_media_msg_title">?????? ?????????????? ?????????? ?????????? ??????</span>
                                                            <IconButton onClick={this.resetSearch}>
                                                                <CloudUploadIcon />
                                                            </IconButton>
                                                        </div>
                                                    )
                                                ) : null}
                                            </div>
                                        </div>
                                    </Scrollbars>
                                </div>
                            </div>
                        </Box>
                    </FileDrop>
                </Box>
            </Modal>
        )
    }

    onScrollBody = (e) => {
        let scrollTop = e.target.scrollTop
        if (scrollTop <= 10) {
            this.#setStateItem('navbar_has_shadow', false)
        } else if (this.state.navbar_has_shadow !== true) {
            this.#setStateItem('navbar_has_shadow', true)
        }
    }

    #isImage = (item) => {
        let imageFormat = ['png', 'jpg', 'jpeg', 'svg', 'gif']
        return imageFormat.indexOf(item.format) > -1
    }

    #getImageThumbnailedUrl = (media) => {
        let child = media.children[3]
        if (!child) {
            child = media.children[2]
            if (!child) {
                child = media.children[0]
            }
        }

        return encodeURI(this.props.baseURL + '' + (child ? child.path : media.path))
    }

    onMediaClick = (item) => () => {
        let selectionType = this.props.selection_type
        if (selectionType === 'single') {
            this.props.onSelectCallBack(item)
            this.closeGeneralModal()
        }
    }

    renderMediaItem = (item) => {
        let imageUrl = this.#isImage(item) ? this.#getImageThumbnailedUrl(item) : ''
        return (
            <Grid item className="sm_media_inner m-0" xs={3} key={item.id}>
                <div className="sm_media_item" onDoubleClick={this.onClickMedia(item)} onClick={this.onMediaClick(item)}>
                    <div className="sm_media">
                        <div className="sm_media_image" style={{ backgroundImage: `url('${imageUrl}')` }}>
                            {!this.#isImage(item) ? <FileFormat format={item.format} /> : null}
                        </div>
                    </div>
                    <div className="sm_media_data">
                        <span className="sm_media_format">
                            <FileFormat format={item.format} className="sm_media_format_icon" />
                        </span>
                        <span className="sm_media_name" title={item.users[0].pivot.title}>
                            {item.users[0].pivot.title}
                        </span>
                    </div>
                </div>
            </Grid>
        )
    }

    renderUploadStatus = (item) => {
        switch (item.event.status) {
            case 'uploading':
                return (
                    <div className="sm_uploading_status_sending">
                        <span className="uploading_percentage">{Math.ceil(item.event.percentage)}%</span>
                        <CircularProgress variant="determinate" value={Math.ceil(item.event.percentage)} />
                    </div>
                )
            case 'pendding':
                return (
                    <div className="sm_uploading_status_confirming">
                        <CloudUploadIcon className="sm_uploading_status_confirming_icon" />
                        <CircularProgress color="inherit" />
                    </div>
                )
            case 'success':
                return (
                    <span className="upload_success_icon">
                        <CheckIcon />
                    </span>
                )
            case 'failed':
                return (
                    <span className="upload_failed_icon">
                        <CloseIcon />
                    </span>
                )
            default:
                return null
        }
    }

    finishUpload = (item) => {
        this.setState((state) => {
            state.uploadingItems = state.uploadingItems.map((media) => {
                if (media.key === item.key) {
                    media.event.finishing = true
                }
                return media
            })
            return { ...state }
        })

        setTimeout(() => {
            this.setState((state) => {
                state.uploadingItems = state.uploadingItems.map((media) => {
                    if (media.key === item.key) {
                        media.event.finished = true
                    }
                    return media
                })
                return { ...state }
            })
            setTimeout(() => {
                this.setState((state) => {
                    state.uploadingItems = state.uploadingItems.filter((media) => media.key !== item.key)
                    return { ...state }
                })
            }, 1000)
        }, 4000)
    }

    renderUploadingSection = () => {
        return (
            <Fragment>
                <div className={(this.state.showUploading ? 'sm_uploading_open' : '') + ' sm_uploading'}>
                    <div className="sm_uploading-items_wrapper">
                        {this.state.uploadingItems.map((item) => (
                            <div className={(item.event.finished ? 'sm_uploading-item_inner_finished' : '') + ' sm_uploading-item_inner'} key={item.key}>
                                <div className="sm_uploading-item">
                                    <div className="sm_uploading_status">{this.renderUploadStatus(item)}</div>
                                    <div className="sm_uploading_name">{item.file.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Fragment>
        )
    }

    onClickMedia = (media) => () => {
        this.#setStateItem('details', {
            show: true,
            data: media,
        })
    }

    onCloseMediaDetails = () => {
        this.setState((state) => {
            state.details.show = false
            return { ...state }
        })
    }

    copy = (e) => {
        e.target.select()
        document.execCommand('copy')
    }

    renderDetailsContents = () => {
        let media = this.state.details.data
        let imageUrl = media && this.#isImage(media) ? this.#getImageThumbnailedUrl(media) : ''
        let path = media ? this.props.this.props.baseURL.replace(/\/$/, '') + '/' + media.path.replace(/^\//, '') : ''
        return media ? (
            <Fragment>
                <div className={(this.state.details.show ? '' : 'sm_dt_wrapper_hide ') + 'sm_dt_wrapper'}>
                    <IconButton className="sm_dt_close" size={'small'} onClick={this.onCloseMediaDetails}>
                        <CloseIcon />
                    </IconButton>
                    <div className="sm_dt_image" style={{ backgroundImage: `url('${imageUrl}')` }}>
                        {!this.#isImage(media) ? <FileFormat format={media.format} /> : null}
                    </div>
                    <div className="dt_sm_file_contents">
                        <div className="sm_dt_date_and_size">
                            <div className="sm_dt_format">
                                <FileFormat format={media.format} />
                            </div>
                            <div className="sm_dt_data">
                                <span className="sm_dt_size">{humanFileSize(media.size)}</span>
                                <span className="sm_dt_created_at">
                                    <span>???????????????? ?????? ???? </span>
                                    <span>{toJalaliDate(media.created_at)}</span>
                                </span>
                            </div>
                        </div>

                        <div className="sm_dt_info_section">
                            <label htmlFor="" className="sm_dt_info_label">
                                ?????? ????????
                            </label>
                            <input type="text" readOnly className="sm_dt_info" value={media.users[0].pivot.title} />
                        </div>
                        <div className="sm_dt_info_section">
                            <label htmlFor="" className="sm_dt_info_label">
                                ???????? ????????
                            </label>
                            <input type="text" readOnly className="sm_dt_info" value={path} onClick={this.copy} />
                        </div>
                        {this.#isImage(media) ? (
                            <div className="sm_dt_info_section">
                                <label htmlFor="" className="sm_dt_info_label">
                                    ?????????? ????????
                                </label>
                                <div className="sm_dt_info_dubble_wrapper">
                                    <span className="sm_dt_info_item">
                                        <span className="sm_dt_info_item_label">??????</span>
                                        <span className="sm_dt_info_item_value">{media.width} px</span>
                                    </span>
                                    <span className="sm_dt_info_item">
                                        <span className="sm_dt_info_item_label">??????</span>
                                        <span className="sm_dt_info_item_value">{media.height} px</span>
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <div className="sm_dt_info_section">
                            <label htmlFor="" className="sm_dt_info_label">
                                ??????????????
                            </label>
                            <textarea className={(this.#isImage(media) ? '' : 'sm_txa_full') + ' sm_dt_info_textarea'} readOnly></textarea>
                        </div>
                    </div>
                </div>
            </Fragment>
        ) : null
    }

    render() {
        return (
            <Fragment>
                {this.renderUploadingSection()}
                {this.renderGeneralModal()}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    media: state.smartcrud.media,
    loading: state.smartcrud.media_loading,
    show: state.smartcrud.media_modal_show,
    selection_type: state.smartcrud.media_selection_type,
    onSelectCallBack: state.smartcrud.media_on_select,
    baseURL: state.smartcrud.config.axios.defaults.baseURL,
})

const mapDispatchToProps = (dispatch) => ({
    getMediaList: (request) => dispatch(media_get_list(request)),
    uploadMedia: (data, config) => dispatch(media_upload(data, config)),
    setMediaModalShowTo: (to) => dispatch(set_media_modal_show_to(to)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaBase)
