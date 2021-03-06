import React, { Component, Fragment } from 'react'
import { Box, CircularProgress, IconButton, InputAdornment, Modal, TextField } from '@material-ui/core'
import { delete_morph, get_morph, post_morph } from '../../Redux/action'
import { connect } from 'react-redux'
import { routeToKey } from './../../Helpers/general'
import SearchIcon from '@material-ui/icons/Search'
import DoneIcon from '@material-ui/icons/Done'
import InfoRoundedIcon from '@material-ui/icons/InfoRounded'
import ReplayRoundedIcon from '@material-ui/icons/ReplayRounded'
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
class Tags extends Component {
    state = {
        show: false,
        type: null,
        key: null,
        data: [],
        searchedData: [],
        loading: true,
        insertError: false,
        posting: false,
    }

    route = '/api/v4/tags'
    type_name = 'tagable_type'
    id_name = 'tagable_id'
    selector = 'title'

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

    #setType = (type) => {
        this.#setStateItem('type', type)
    }

    #setKey = (key) => {
        this.#setStateItem('key', key)
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState((state) => {
            let ns = { ...state }
            if (this.props.morph[this.state.type] && this.props.morph[this.state.type][this.state.key]) {
                ns.data = this.props.morph[this.state.type][this.state.key].data
                ns.searchedData = this.props.morph[this.state.type][this.state.key].data
                ns.loading = this.props.morph[this.state.type][this.state.key].loading
            }
            return ns
        })
    }

    open = (type, data) => {
        this.#setShowTo(true)()
        this.#setType(type)
        this.#setKey(routeToKey(this.route))
        this.#setStateItem('taggable_row', data)

        this.props.get_morph(
            {
                id_name: this.id_name,
                type_name: this.type_name,
                route: this.route,
                type: type,
            },
            data
        )
    }

    #onSearch = (e) => {
        let value = e.target.value
        this.setState((state) => {
            let ns = { ...state }
            ns.searchedData = value.length > 0 ? ns.data.filter((item) => item[this.selector].indexOf(value) > -1) : ns.data
            return ns
        })
    }

    #resetSearch = () => {
        this.searchInput.value = ''
        this.setState((state) => {
            let ns = { ...state }
            ns.searchedData = ns.data
            return ns
        })
        this.searchInput.focus()
    }

    removeTag = (data) => () => {
        data.__deleting = true
        this.forceUpdate()

        this.props
            .delete_morph(
                {
                    id_name: this.id_name,
                    type_name: this.type_name,
                    route: this.route,
                    type: this.state.type,
                    data: data,
                },
                data
            )
            .then(() => {
                data.__deleting = false
                this.forceUpdate()
            })
            .catch(() => {
                data.__deleting = false
                this.forceUpdate()
            })

        // Dialog({
        //     title: "?????? ????",
        //     description: <span>???? ?????? ???? <b>{data[this.selector]}</b> ?????????????? ?????????? ??</span>,
        //     yes: "?????????? ?? ??????",
        //     no: "??????",
        //     onAccept: () => {
        //         data.__deleting = true;
        //         this.forceUpdate();

        //         this.props.delete_morph({
        //             id_name: this.id_name,
        //             type_name: this.type_name,
        //             route: this.route,
        //             type: this.state.type,
        //             data: data,
        //         }, data).then(() => {
        //             data.__deleting = false;
        //             this.forceUpdate();
        //         }).catch(() => {
        //             data.__deleting = false;
        //             this.forceUpdate();
        //         })
        //     }
        // });
    }

    createTag = () => {
        let value = this.insertInput.value
        this.insertInput.focus()
        if (!value) {
            clearTimeout(this.insertErrorTimeout)
            this.#setStateItem('insertError', true)
            this.insertErrorTimeout = setTimeout(() => {
                this.#setStateItem('insertError', false)
            }, 2000)
            return false
        }

        let data = {}
        data[this.selector] = value
        data[this.type_name] = this.state.type
        data[this.id_name] = this.state.taggable_row.id

        this.#setStateItem('posting', true)
        this.props
            .post_morph(
                {
                    id_name: this.id_name,
                    type_name: this.type_name,
                    route: this.route,
                    type: this.state.type,
                },
                data
            )
            .then((response) => {
                this.insertInput.value = ''
                this.#setStateItem('posting', false)
            })
            .catch((error) => {
                this.#setStateItem('posting', false)
            })
    }

    onKeyupInsertInput = (e) => {
        if (this.state.insertError) this.#setStateItem('insertError', false)
        if (e.keyCode === 13) {
            return this.createTag()
        }
    }

    render() {
        return (
            <Fragment>
                <Modal className="sc-modal-wrapper" size="md" open={this.state.show} onClose={this.#setShowTo(false)}>
                    <Box className="sc-modal-inner">
                        <div className="sc-modal-header">
                            <div className="sc-modal-title">???????????? ???? ????</div>
                        </div>
                        <div className="sc-modal-body">
                            <Box p={3}>
                                <div className="smartcrud_tags_search_wrapper">
                                    <TextField
                                        placeholder="??????????"
                                        fullWidth
                                        onChange={this.#onSearch}
                                        inputRef={(el) => (this.searchInput = el)}
                                        InputProps={{
                                            endAdornment: <SearchIcon />,
                                        }}
                                    />
                                </div>
                                <div className="smartcrud_morph_tag_wrapper">
                                    {this.state.loading ? (
                                        <div className="smartcrud_morph_tag_loading_wrapper">
                                            <span>?????????? ???????????? ?????????????? ...</span>
                                            <CircularProgress color="inherit" />
                                        </div>
                                    ) : this.state.searchedData.length ? (
                                        this.state.searchedData.map((tag, index) => {
                                            return (
                                                <div key={index} className="smartcrud_morph_tag_item">
                                                    <div className="smartcrud_tag_item_content">
                                                        <span>
                                                            <ArrowBackIcon />
                                                        </span>
                                                        <span> {tag[this.selector]} </span>
                                                    </div>
                                                    <div className={(tag.__deleting ? '_deleting' : '') + 'smartcrud_tag_item_delete_wrapper'}>
                                                        {tag.__deleting ? (
                                                            <CircularProgress className="smartcrud_tag_item_deleting" />
                                                        ) : (
                                                            <IconButton size="small" onClick={this.removeTag(tag)}>
                                                                <CloseIcon className="text-danger" />
                                                            </IconButton>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="smartcrud_tags_empty_wrapper">
                                            {this.state.data.length > 0 && !this.state.searchedData.length ? (
                                                <Fragment>
                                                    <span className="smartcrud_tags_empty">?????? ?????????? ???????? ??????</span>
                                                    <IconButton onClick={this.#resetSearch}>
                                                        <ReplayRoundedIcon color="primary" />
                                                    </IconButton>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <span className="smartcrud_tags_empty">?????? ?????????? ???????? ??????????</span>
                                                    <InfoRoundedIcon className="smartcrud_tags_info_icon" />
                                                </Fragment>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="smartcrud_morph_tag_insert_wrapper">
                                    <TextField
                                        placeholder="?????????? ???? ????????"
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        error={this.state.insertError}
                                        // helperText={this.state.insertError ? "?????????? ???? ???????????????? ???????? ????????" : "?????????? ???? ???? ???????? ????????"}
                                        inputRef={(el) => (this.insertInput = el)}
                                        onKeyUp={this.onKeyupInsertInput}
                                        InputProps={{
                                            readOnly: this.state.posting,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ArrowBackIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {this.state.posting ? (
                                                        <CircularProgress className="smartcrud_tags_posting" />
                                                    ) : (
                                                        <IconButton edge="end" onClick={this.createTag}>
                                                            <DoneIcon />
                                                        </IconButton>
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Tags)
