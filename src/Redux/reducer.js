import * as consts from './constans'
import { routeToKey } from './../Helpers/general'

const initState = {
    merchants: [],
    morph: {},
    media: [],
    media_loading: false,
    media_modal_show: false,
    media_selection_type: null,
    media_on_select: () => {},
}

const smartcrudReducer = (state = initState, action) => {
    // console.log(action)
    let key, routeKey, type, results

    switch (action.type) {
        case consts.GET_DATA_STARTED:
            key = action.request.route.replace(/\//g, '_')
            if (typeof state[key] !== 'object') {
                state[key] = {
                    loaded: false,
                }
            } else {
                state[key].loaded = false
            }
            return { ...state }
        case consts.GET_DATA_SUCCESS:
            key = action.request.route.replace(/\//g, '_')
            state[key].loaded = true
            state[key].data = action.response.data.data.data
            state[key].total_page = action.response.data.data.last_page
            state[key].total_item = action.response.data.data.total
            state[key].current_page = action.response.data.data.current_page
            state[key].summations = action.response.data.summations
            return { ...state }
        case consts.GET_DATA_FAILED:
            key = action.request.route.replace(/\//g, '_')
            state[key].loaded = true
            return { ...state }
        case consts.GET_SMART_CRUD_DATA_STARTED:
            key = action.request.route.replace(/\//g, '_')
            if (typeof state[key] !== 'object') {
                state[key] = {
                    loaded: false,
                }
            } else {
                state[key].loaded = false
            }
            return { ...state }
        case consts.GET_SMART_CRUD_DATA_SUCCESS:
            key = action.request.route.replace(/\//g, '_')
            if (action.mutator && typeof action.mutator === 'function') {
                results = action.mutator({ ...action.response })
            } else {
                results = action.response.data.results || action.response.data.data
            }
            state[key].loaded = true
            state[key].data = results.data
            state[key].total_page = results.last_page
            state[key].total_item = results.total
            state[key].current_page = results.current_page
            state[key].summations = results.summations || {}
            return { ...state }
        case consts.GET_SMART_CRUD_DATA_FAILED:
            key = action.request.route.replace(/\//g, '_')
            state[key].loaded = true
            state[key].data = []
            state[key].total_page = null
            state[key].total_item = null
            state[key].current_page = 1
            state[key].summations = {}
            return { ...state }

        case consts.GET_MERCHANTS_STARTED:
            return { ...state }
        case consts.GET_MERCHANTS_SUCCESS:
            results = action.response.data.results || action.response.data.data
            state.merchants = action.response.data.results.data
            return { ...state }
        case consts.GET_MERCHANTS_FAILED:
            return { ...state }
        case consts.SET_PAGINATION_TO:
            state[action.key].current_page = action.page
            return { ...state }
        case consts.UPDATE_A_ROW_STATE:
            try {
                if (!action.row.id) throw '[UPDATE_A_ROW_STATE] row have not a uniq id / Datatable Reducer'

                key = routeToKey(action.key)
                state[key].data = state[key].data.map((item) => {
                    if (item.id === action.row.id) {
                        return { ...action.row }
                    }
                    return { ...item }
                })
            } catch (error) {
                console.error(error)
            }

            return { ...state }
        case consts.RELOAD_DATATABLE:
            key = routeToKey(action.key)
            setTimeout(() => {
                document.getElementById(key).click()
            }, 0)
            return { ...state }
        case consts.EDIT_STARTED:
            return { ...state }
        case consts.EDIT_SUCCESS:
            return { ...state }
        case consts.EDIT_FAILED:
            return { ...state }
        case consts.DELETE_STARTED:
            return { ...state }
        case consts.DELETE_SUCCESS:
            return { ...state }
        case consts.DELETE_FAILED:
            return { ...state }
        case consts.GET_MORPH_STARTED:
            routeKey = routeToKey(action.request.route)
            type = action.request.type

            if (!state.morph.hasOwnProperty(type)) {
                state.morph[type] = {}
            }

            if (!state.morph[type].hasOwnProperty(routeKey)) {
                state.morph[type][routeKey] = {}
            }

            state.morph[type][routeKey] = {
                loading: true,
                data: [],
            }

            return { ...state }

        case consts.GET_MORPH_SUCCESS:
            routeKey = routeToKey(action.request.route)
            type = action.request.type
            results = action.response.data.results || action.response.data.data

            state.morph[type][routeKey].loading = false
            state.morph[type][routeKey].data = action.response.data.results.data

            return { ...state }

        case consts.GET_MORPH_FAILED:
            routeKey = routeToKey(action.request.route)
            type = action.request.type

            state.morph[type][routeKey] = {
                loading: false,
                data: [],
            }

            return { ...state }

        case consts.POST_MORPH_STARTED:
            routeKey = routeToKey(action.request.route)
            type = action.request.type
            return { ...state }

        case consts.POST_MORPH_SUCCESS:
            routeKey = routeToKey(action.request.route)
            type = action.request.type
            results = action.response.data.results || action.response.data.data

            let postedItem = results
            state.morph[type][routeKey].data.unshift(postedItem)
            return { ...state }

        case consts.POST_MORPH_FAILED:
            return { ...state }

        case consts.EDIT_MORPH_STARTED:
            return { ...state }

        case consts.EDIT_MORPH_SUCCESS:
            return { ...state }

        case consts.EDIT_MORPH_FAILED:
            return { ...state }

        case consts.DELETE_MORPH_STARTED:
            return { ...state }

        case consts.DELETE_MORPH_SUCCESS:
            routeKey = routeToKey(action.request.route)
            type = action.request.type
            let deleteItem = action.request.data
            state.morph[type][routeKey].data = state.morph[type][routeKey].data.filter((item) => item.id !== deleteItem.id)
            return { ...state }

        case consts.DELETE_MORPH_FAILED:
            return { ...state }
        case consts.DELETE_HAS_MANY_RELATION_ITEM_STARTED:
            return { ...state }
        case consts.DELETE_HAS_MANY_RELATION_ITEM_SUCCESS:
            return { ...state }
        case consts.DELETE_HAS_MANY_RELATION_ITEM_FAILED:
            return { ...state }

        case consts.MEDIA_GET_LIST_STARTED:
            state.media_loading = true
            state.media = []
            return { ...state }
        case consts.MEDIA_GET_LIST_SUCCESS:
            state.media_loading = false
            state.media = action.response.data.data
            return { ...state }
        case consts.MEDIA_GET_LIST_FAILED:
            state.media_loading = false
            state.media = []
            return { ...state }
        case consts.SET_MEDIA_MODAL_SHOW_TO:
            state.media_modal_show = action.to
            state.media_selection_type = action.selectionType
            state.media_on_select = action.onSelect
            return { ...state }

        case consts.MEDIA_UPLOAD_STARTED:
            return { ...state }
        case consts.MEDIA_UPLOAD_SUCCESS:
            let dataToPush = action.response.data.data
            let media = [...state.media]
            media.unshift(dataToPush)
            state.media = media
            return { ...state }
        case consts.MEDIA_UPLOAD_FAILED:
            return { ...state }

        default:
            return { ...state }
    }
}

export default smartcrudReducer
