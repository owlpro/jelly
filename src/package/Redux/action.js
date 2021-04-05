import * as consts from './constans'
import axios from 'axios'

const getDataStarted = (request) => ({ type: consts.GET_DATA_STARTED, request })
const getDataSuccess = (request, response) => ({ type: consts.GET_DATA_SUCCESS, response, request })
const getDataFailed = (request, error) => ({ type: consts.GET_DATA_FAILED, error, request })
export const getData = (request, successCallBack) => (dispatch) => {
    dispatch(getDataStarted(request))
    axios
        .get(request.route + request.query)
        .then(async (response) => {
            dispatch(getDataSuccess(request, response))
            setTimeout(() => {
                successCallBack(response)
            }, 0)
        })
        .catch((error) => {
            dispatch(getDataFailed(request, error))
        })
}

const getFromSmartCrudDataStarted = (request) => ({ type: consts.GET_SMART_CRUD_DATA_STARTED, request })
const getFromSmartCrudSuccess = (request, response, mutator) => ({ type: consts.GET_SMART_CRUD_DATA_SUCCESS, response, request, mutator })
const getFromSmartCrudFailed = (request, error) => ({ type: consts.GET_SMART_CRUD_DATA_FAILED, error, request })
export const getFromSmartCrud = (request, mutator = null) => (dispatch) => {
    dispatch(getFromSmartCrudDataStarted(request))
    return new Promise((resolve, reject) => {
        axios
            .get(request.route + request.query)
            .then(async (response) => {
                dispatch(getFromSmartCrudSuccess(request, response, mutator))
                setTimeout(() => {
                    resolve(response)
                }, 0)
            })
            .catch((error) => {
                dispatch(getFromSmartCrudFailed(request, error))
                reject(error)
            })
    })
}

const getMerchantsStarted = () => ({ type: consts.GET_MERCHANTS_STARTED })
const getMerchantsSuccess = (response) => ({ type: consts.GET_MERCHANTS_SUCCESS, response })
const getMerchantsFailed = (error) => ({ type: consts.GET_MERCHANTS_FAILED, error })
export const getMerchants = (successCallBack) => (dispatch) => {
    let access = JSON.parse(localStorage.getItem('access'))
    dispatch(getMerchantsStarted())
    let route = `/api/v4/merchants?page_size=1000`
    if (access.club) {
        route += `&filters=[[["clubs.name", "=", "${access.club.name}"]]]`
    }

    axios
        .get(route)
        .then(async (response) => {
            dispatch(getMerchantsSuccess(response))
            setTimeout(() => {
                successCallBack(response)
            }, 0)
        })
        .catch((error) => {
            dispatch(getMerchantsFailed(error))
        })
}

export const setDTPaginationTo = (key, page) => ({ type: consts.SET_PAGINATION_TO, key, page })
export const updateDatatableRow = (key, row) => ({ type: consts.UPDATE_A_ROW_STATE, key, row })
export const reloadDataTable = (key) => ({ type: consts.RELOAD_DATATABLE, key })

const createStarted = (request) => ({ type: consts.CREATE_STARTED, request })
const createSuccess = (request, response) => ({ type: consts.CREATE_SUCCESS, response, request })
const createFailed = (request, error) => ({ type: consts.CREATE_FAILED, error, request })

export const createItem = (request, data) => (dispatch) => {
    dispatch(setPageLoadingTo(true, 'درحال ایجاد ...'))
    dispatch(createStarted(request))
    return new Promise((resolve, reject) => {
        axios
            .post(request.route, data)
            .then((response) => {
                dispatch(createSuccess(response))
                resolve(response)
                dispatch(setPageLoadingTo(false, 'با موفقیت ایجاد شد', true))
            })
            .catch((error) => {
                dispatch(createFailed(error))
                reject(error)
                dispatch(setPageLoadingTo(false, 'ایجاد با شکست مواجه شد', false))
            })
    })
}

const editStarted = (request) => ({ type: consts.EDIT_STARTED, request })
const editSuccess = (request, response) => ({ type: consts.EDIT_SUCCESS, response, request })
const editFailed = (request, error) => ({ type: consts.EDIT_FAILED, error, request })

export const editItem = (request, data) => (dispatch) => {
    dispatch(setPageLoadingTo(true, 'درحال ویرایش ...'))
    dispatch(editStarted(request))
    return new Promise((resolve, reject) => {
        axios
            .put(request.route + '/' + data.id, data)
            .then((response) => {
                dispatch(editSuccess(response))
                resolve(response)
                dispatch(setPageLoadingTo(false, 'ویرایش با موفقیت انجام شد', true))
            })
            .catch((error) => {
                dispatch(editFailed(error))
                reject(error)
                dispatch(setPageLoadingTo(false, 'ویرایش با شکست مواجه شد', false))
            })
    })
}

const deleteStarted = (request) => ({ type: consts.DELETE_STARTED, request })
const deleteSuccess = (request, response) => ({ type: consts.DELETE_SUCCESS, response, request })
const deleteFailed = (request, error) => ({ type: consts.DELETE_FAILED, error, request })

export const deleteItem = (request, data) => (dispatch) => {
    dispatch(setPageLoadingTo(true, 'درحال حذف ...'))
    dispatch(deleteStarted(request))
    return new Promise((resolve, reject) => {
        axios
            .delete(request.route + '/' + data.id)
            .then((response) => {
                dispatch(setPageLoadingTo(false, 'حذف با موفقیت انجام شد', true))
                dispatch(deleteSuccess(response))
                resolve(response)
            })
            .catch((error) => {
                dispatch(setPageLoadingTo(false, 'حذف با شکست مواجه شد', false))
                dispatch(deleteFailed(error))
                reject(error)
            })
    })
}

const get_morph_started = (request) => ({ type: consts.GET_MORPH_STARTED, request })
const get_morph_success = (request, response) => ({ type: consts.GET_MORPH_SUCCESS, request, response })
const get_morph_failed = (request, error) => ({ type: consts.GET_MORPH_FAILED, request, error })
export const get_morph = (request, data) => (dispatch) => {
    dispatch(get_morph_started(request))
    return new Promise((resolve, reject) => {
        axios
            .get(request.route + `?page_size=1000&filters=[["${request.type_name}", "=", "${request.type}"], ["${request.id_name}", "=", "${data.id}"]]`)
            .then((response) => {
                dispatch(get_morph_success(request, response))
                resolve(response)
            })
            .catch((error) => {
                dispatch(get_morph_failed(request, error))
                reject(error)
            })
    })
}

const post_morph_started = (request) => ({ type: consts.POST_MORPH_STARTED, request })
const post_morph_success = (request, response) => ({ type: consts.POST_MORPH_SUCCESS, request, response })
const post_morph_failed = (request, error) => ({ type: consts.POST_MORPH_FAILED, request, error })
export const post_morph = (request, data) => (dispatch) => {
    dispatch(post_morph_started(request))
    return new Promise((resolve, reject) => {
        axios
            .post(request.route, data)
            .then((response) => {
                dispatch(post_morph_success(request, response))
                resolve(response)
            })
            .catch((error) => {
                dispatch(post_morph_failed(request, error))
                reject(error)
            })
    })
}

const edit_morph_started = (request) => ({ type: consts.EDIT_MORPH_STARTED, request })
const edit_morph_success = (request, response) => ({ type: consts.EDIT_MORPH_SUCCESS, request, response })
const edit_morph_failed = (request, error) => ({ type: consts.EDIT_MORPH_FAILED, request, error })
export const edit_morph = (request, data) => (dispatch) => {
    dispatch(edit_morph_started(request))
    return new Promise((resolve, reject) => {})
}

const delete_morph_started = (request) => ({ type: consts.DELETE_MORPH_STARTED, request })
const delete_morph_success = (request, response) => ({ type: consts.DELETE_MORPH_SUCCESS, request, response })
const delete_morph_failed = (request, error) => ({ type: consts.DELETE_MORPH_FAILED, request, error })
export const delete_morph = (request, data) => (dispatch) => {
    dispatch(delete_morph_started(request))
    return new Promise((resolve, reject) => {
        axios
            .delete(request.route + '/' + data.id)
            .then((response) => {
                dispatch(delete_morph_success(request, response))
                resolve(response)
            })
            .catch((error) => {
                dispatch(delete_morph_failed(request, error))
                reject(error)
            })
    })
}

const deleteHasManyRelationStarted = (request) => ({ type: consts.DELETE_HAS_MANY_RELATION_ITEM_STARTED, request })
const deleteHasManyRelationSuccess = (request, response) => ({ type: consts.DELETE_HAS_MANY_RELATION_ITEM_SUCCESS, response, request })
const deleteHasManyRelationFailed = (request, error) => ({ type: consts.DELETE_HAS_MANY_RELATION_ITEM_FAILED, error, request })
export const deleteHasManyRelationItem = (request, data) => (dispatch) => {
    dispatch(setPageLoadingTo(true, 'در حال حذف رابطه ...', null))
    dispatch(deleteHasManyRelationStarted(request))
    return new Promise((resolve, reject) => {
        axios
            .delete(request.route, { data: data })
            .then((response) => {
                dispatch(setPageLoadingTo(false, 'حذف رابطه با موفقیت انجام شد', true))
                dispatch(deleteHasManyRelationSuccess(response))
                resolve(response)
            })
            .catch((error) => {
                dispatch(setPageLoadingTo(false, 'حذف رابطه با شکست مواجه شد', false))
                dispatch(deleteHasManyRelationFailed(error))
                reject(error)
            })
    })
}

export const set_media_modal_show_to = (to, selectionType = null, onSelect = () => {}) => (dispatch) => {
    if (to === true) {
        dispatch(media_get_list())
    }
    // selection types are [single | multiple | null]
    dispatch({ type: consts.SET_MEDIA_MODAL_SHOW_TO, to, selectionType, onSelect })
}

const media_get_list_started = (request) => ({ type: consts.MEDIA_GET_LIST_STARTED, request })
const media_get_list_success = (request, response) => ({ type: consts.MEDIA_GET_LIST_SUCCESS, response, request })
const media_get_list_failed = (request, error) => ({ type: consts.MEDIA_GET_LIST_FAILED, error, request })
export const media_get_list = (request = null) => (dispatch) => {
    // dispatch(setPageLoadingTo(true, '', null))
    dispatch(media_get_list_started(request))
    return new Promise((resolve, reject) => {
        let route = request && request.id ? '/api/v4/media/' + request.id : '/api/v4/media'
        axios
            .get(route)
            .then((response) => {
                // console.log(response)
                setTimeout(() => {
                    // dispatch(setPageLoadingTo(false, '', true))
                    dispatch(media_get_list_success(request, response))
                    resolve(response)
                }, 0)
            })
            .catch((error) => {
                // dispatch(setPageLoadingTo(false, '', false))
                dispatch(media_get_list_failed(request, error))
                reject(error)
            })
    })
}

const media_upload_started = () => ({ type: consts.MEDIA_UPLOAD_STARTED })
const media_upload_success = (response) => ({ type: consts.MEDIA_UPLOAD_SUCCESS, response })
const media_upload_failed = (error) => ({ type: consts.MEDIA_UPLOAD_FAILED, error })
export const media_upload = (data, config = {}) => (dispatch) => {
    dispatch(media_upload_started())
    return new Promise((resolve, reject) => {
        axios
            .post('/api/v4/media', data, config)
            .then((response) => {
                dispatch(media_upload_success(response))
                resolve(response)
            })
            .catch((error) => {
                dispatch(media_upload_failed(error))
                reject(error)
            })
    })
}

const media_delete_started = (request) => ({ type: consts.MEDIA_DELETE_STARTED, request })
const media_delete_success = (request, response) => ({ type: consts.MEDIA_DELETE_SUCCESS, response, request })
const media_delete_failed = (request, error) => ({ type: consts.MEDIA_DELETE_FAILED, error, request })
export const media_delete = (request, data) => (dispatch) => {
    // dispatch(setPageLoadingTo(true, '', null))
    dispatch(media_delete_started(request))
    return new Promise((resolve, reject) => {
        axios
            .delete(request.route, data)
            .then((response) => {
                // dispatch(setPageLoadingTo(false, '', true))
                dispatch(media_delete_success(response))
                resolve(response)
            })
            .catch((error) => {
                // dispatch(setPageLoadingTo(false, '', false))
                dispatch(media_delete_failed(error))
                reject(error)
            })
    })
}

const media_update_information_started = (request) => ({ type: consts.MEDIA_UPDATE_INFORMATION_STARTED, request })
const media_update_information_success = (request, response) => ({ type: consts.MEDIA_UPDATE_INFORMATION_SUCCESS, response, request })
const media_update_information_failed = (request, error) => ({ type: consts.MEDIA_UPDATE_INFORMATION_FAILED, error, request })
export const media_update_information = (request, data) => (dispatch) => {
    // dispatch(setPageLoadingTo(true), '', null)
    dispatch(media_update_information_started(request))
    return new Promise((resolve, reject) => {
        axios
            .put(request.route, data)
            .then((response) => {
                // dispatch(setPageLoadingTo(false, '', true))
                dispatch(media_update_information_success(response))
                resolve(response)
            })
            .catch((error) => {
                // dispatch(setPageLoadingTo(false, '', false))
                dispatch(media_update_information_failed(error))
                reject(error)
            })
    })
}

const media_update_shear_with_started = (request) => ({ type: consts.MEDIA_UPDATE_SHEAR_WITH_STARTED, request })
const media_update_shear_with_success = (request, response) => ({ type: consts.MEDIA_UPDATE_SHEAR_WITH_SUCCESS, response, request })
const media_update_shear_with_failed = (request, error) => ({ type: consts.MEDIA_UPDATE_SHEAR_WITH_FAILED, error, request })
export const media_update_shear_with = (request, data) => (dispatch) => {
    // dispatch(setPageLoadingTo(true, '', null))
    dispatch(media_update_shear_with_started(request))
    return new Promise((resolve, reject) => {
        axios
            .post(request.route, data)
            .then((response) => {
                // dispatch(setPageLoadingTo(false, '', true))
                dispatch(media_update_shear_with_success(response))
                resolve(response)
            })
            .catch((error) => {
                // dispatch(setPageLoadingTo(false, '', false))
                dispatch(media_update_shear_with_failed(error))
                reject(error)
            })
    })
}

const media_save_to_gallery_started = (request) => ({ type: consts.MEDIA_SAVE_TO_GALLERY_STARTED, request })
const media_save_to_gallery_success = (request, response) => ({ type: consts.MEDIA_SAVE_TO_GALLERY_SUCCESS, response, request })
const media_save_to_gallery_failed = (request, error) => ({ type: consts.MEDIA_SAVE_TO_GALELRY_FAILED, error, request })
export const media_save_to_gallery = (request, data) => (dispatch) => {
    // dispatch(setPageLoadingTo(true, '', null))
    dispatch(media_save_to_gallery_started(request))
    return new Promise((resolve, reject) => {
        axios
            .post(request.route, data)
            .then((response) => {
                // dispatch(setPageLoadingTo(false, '', true))
                dispatch(media_save_to_gallery_success(response))
                resolve(response)
            })
            .catch((error) => {
                // dispatch(setPageLoadingTo(false, '', false))
                dispatch(media_save_to_gallery_failed(error))
                reject(error)
            })
    })
}

export const closeDialog = () => ({ type: consts.CLOSE_DIALOG })
export const openDialog = (dialogConfig) => ({ type: consts.OPEN_DIALOG, dialogConfig })
export const setPageLoadingTo = (to, message = '', status = null) => ({ type: consts.SET_PAGE_LOADING_TO, to, message, status })

export const store_configs = (config) => ({ type: consts.STORE_CONFIGS, config })
