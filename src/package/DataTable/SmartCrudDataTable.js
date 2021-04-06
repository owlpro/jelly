/* eslint import/no-webpack-loader-syntax: off */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as $ from 'jquery'
import UIButton from '@material-ui/core/Button'
import ClearIcon from '@material-ui/icons/Clear'
import Pagination from './pagination'
import Select from '@material-ui/core/Select'
import LoadingList from './loadingList'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import jMoment from 'moment-jalaali'
import { Number33, Dialog, select, routeToKey } from '../Helpers/general'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { MuiPickersUtilsProvider, DatePicker, DateTimePicker, TimePicker } from '@material-ui/pickers'
import JalaliUtils from '@date-io/jalaali'
import PrintIcon from '@material-ui/icons/Print'
import { setDTPaginationTo, getMerchants, getFromSmartCrud, updateDatatableRow } from '../Redux/action'
import CircularProgress from '@material-ui/core/CircularProgress'
import { DangerAlert } from '../Helpers/alert'
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import RotateLeftRoundedIcon from '@material-ui/icons/RotateLeftRounded'
import NoDataComponent from './noData'
import Switch from 'react-switch'
import SortIcon from '@material-ui/icons/Sort'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import RefreshIcon from '@material-ui/icons/Refresh'
import EqualizerRoundedIcon from '@material-ui/icons/EqualizerRounded'
import { Box, Grid, Modal } from '@material-ui/core'
import MoreItems from '../Components/MoreItems'
import Tags from '../Relations/MorphMany/Tags'
import Attachments from '../Relations/MorphMany/Attachments'
import Checkbox from '@material-ui/core/Checkbox'
import { CSVLink } from 'react-csv'
import GetAppIcon from '@material-ui/icons/GetApp'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ProcessStatus from '../Components/ProcessStatus'
import printStyles from '!!raw-loader!./../Assets/css/list_print.css'
import DatatableBaseComponent from 'react-data-table-component'

jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })

class SmartCrudDataTable extends Component {
    key = routeToKey(this.props.route)
    state = {
        filterItems: [],
        limit: 10,
        current_page: this.props.smartcrud[this.key] ? this.props.smartcrud[this.key].current_page : 1,
        route: this.props.route,
        key: this.key,
        oklabel: 'تایید',
        cancellabel: 'بازگشت',
        hasFilter: false,
        printDropdown: false,
        selects_value: {},
        multiple_selects_value: {},
        strings_value: {},
        numbers_value: {},
        checkboxes_value: {},
        shrink: {},
        dates_value: {
            datetime: {},
            date: {},
            time: {},
        },
        columns: [...this.props.columns],
        print: {
            started: false,
            data: [],
        },
        export: {
            started: false,
            data: [],
        },
        summationsModal: false,
        canFilter: false,
        useFilters: [],
        order_by: [...this.props.columns].filter((item) => item.isDefaultSort)[0]
            ? [...this.props.columns].filter((item) => item.isDefaultSort)[0].selector
            : 'created_at',
        order_by_type: [...this.props.columns].filter((item) => item.isDefaultSort)[0]
            ? [...this.props.columns].filter((item) => item.isDefaultSort)[0].isDefaultSort
            : 'desc',
        checked: {},
    }

    ref = {
        number: {},
        string: {},
    }
    selects_ref = {}

    query = ''
    columns = []

    row = 1

    filterItems = []

    morphManyRelations = {}

    setItem = (key, value) => {
        let exists = this.filterItems.filter((item) => item.key === key).length > 0
        if (exists) {
            this.filterItems = this.filterItems.filter((item) => item.key !== key)
        }

        let itemToPush = {
            key: key.toString(),
            value: value,
        }

        this.filterItems = [...this.filterItems, itemToPush]
    }

    removeItem = (key) => {
        this.filterItems = this.filterItems.filter((item) => item.key !== key)
    }

    getItem = (key) => {
        let item = this.filterItems.filter((item) => item.key === key)
        if (item.length > 0) {
            return item.value
        }
        return ''
    }

    generateQueryString = (page = this.state.current_page, limit = this.state.limit) => {
        let query = []
        let filters = []
        let from_regEx = new RegExp(/_from$/)
        let to_regEx = new RegExp(/_to$/)
        let from_to_regEx = new RegExp(/_to$|_from$/)
        this.filterItems.forEach((item) => {
            if (from_regEx.test(item.key)) {
                filters.push([item.key.replace(from_regEx, ''), '>=', item.value])
            } else if (to_regEx.test(item.key)) {
                filters.push([item.key.replace(to_regEx, ''), '<=', item.value])
            } else {
                if (Array.isArray(item.value)) {
                    if (item.value.filter((f) => Array.isArray(f)).length > 0) {
                        item.value.forEach((f) => filters.push(f))
                    } else {
                        filters.push(item.value)
                    }
                } else {
                    filters.push([item.key.replace(from_to_regEx, ''), 'like', '%' + item.value + '%'])
                }
            }
        })

        let appendFilters = this.props.appendFilter
        if ((filters && filters.length) || appendFilters) {
            if (appendFilters && appendFilters.length) {
                filters = filters.concat(appendFilters)
            }

            query.push('filters=' + JSON.stringify(filters))
        }

        if (this.props.relations && this.props.relations.length) {
            let withPorps = JSON.stringify(this.props.relations)
            query.push('relations=' + withPorps)
        }
        if (this.props.summations && this.props.summations.length) {
            let summationsPorps = JSON.stringify(this.props.summations.map((i) => i.key))
            query.push('summations=' + summationsPorps)
        }

        query.push('page=' + page)
        query.push('page_size=' + limit)
        query.push('order_by=' + JSON.stringify([this.state.order_by, this.state.order_by_type]))

        if (this.props.append && this.props.append.length) {
            query = query.concat(this.props.append)
        }

        console.log(query)

        return '?' + encodeURI(query.join('&'))
    }

    release = () => {
        let queryString = this.generateQueryString()

        this.props
            .getData(
                {
                    route: this.state.route,
                    query: queryString,
                },
                this.props.mutators ? this.props.mutators.onLoad : null
            )
            .then((response) => {
                if (this.props.onLoad) {
                    this.props.onLoad(response)
                }
            })

        if (this.props.onRelease) {
            this.props.onRelease({
                query: queryString,
                data: this.filterItems,
            })
        }

        let useFilters = []
        this.filterItems.map((item) => {
            let itemToPush = { ...item }

            let key = item.key.replace(/_from|_to/, '').trim()

            let isExists = useFilters.filter((item) => item.key === key).length > 0
            let checkForExistsOrderByItems = useFilters.filter((item) => item.key === 'order_by_type' || item.key === 'order_by').length > 0

            if (item.key !== 'search' && !isExists) {
                if (key === 'order_by_type' || key === 'order_by') {
                    if (!checkForExistsOrderByItems) {
                        itemToPush.key = key
                        useFilters.push(itemToPush)
                    }
                } else {
                    itemToPush.key = key
                    useFilters.push(itemToPush)
                }
            }
            return null
        })

        this.setState((state) => {
            const ns = { ...state }
            ns.useFilters = useFilters
            return ns
        })
    }

    checkCanFilter = () => {
        let canFilter = false

        for (let selector in this.state.strings_value) {
            let value = this.state.strings_value[selector]
            if (value) {
                canFilter = true
            }
        }

        for (let selector in this.state.numbers_value) {
            let value = this.state.numbers_value[selector]
            if (value) {
                canFilter = true
            }
        }

        for (let selector in this.state.selects_value) {
            let value = this.state.selects_value[selector]
            if (selector && value) {
                canFilter = true
            }
        }

        for (let selector in this.state.multiple_selects_value) {
            let value = this.state.multiple_selects_value[selector]
            if (selector && value && value.length > 0) {
                canFilter = true
            }
        }

        for (let selector in this.state.dates_value.date) {
            let value = this.state.dates_value.date[selector]
            if (selector && value) {
                canFilter = true
            }
        }

        for (let selector in this.state.dates_value.datetime) {
            let value = this.state.dates_value.datetime[selector]
            if (selector && value) {
                canFilter = true
            }
        }

        for (let selector in this.state.dates_value.time) {
            let value = this.state.dates_value.time[selector]
            if (selector && value) {
                canFilter = true
            }
        }

        for (let selector in this.state.checkboxes_value) {
            let value = this.state.checkboxes_value[selector]
            if (selector && value) {
                canFilter = true
            }
        }

        this.setState((state) => {
            const ns = { ...state }
            ns.canFilter = canFilter
            return ns
        })
    }

    onChangeCheckboxSelection = (row) => async (event) => {
        let isChecked = event.target.checked

        if (row.__select__ === isChecked) {
            return false
        }

        row.__select__ = isChecked
        await this.props.updateDatatableRow(this.key, row)

        if (typeof this.props.onChangeSelection === 'function') {
            this.props.onChangeSelection(row.__select__, row)
        }
    }

    setRowSelection = async (row, newState) => {
        if (row.__select__ === newState) {
            return false
        }

        row.__select__ = newState
        await this.props.updateDatatableRow(this.key, row)

        if (typeof this.props.onChangeSelection === 'function') {
            this.props.onChangeSelection(row.__select__, row)
        }
    }

    deselectAllRows = () => {
        let data = this.props.smartcrud[this.key] && this.props.smartcrud[this.key].data ? this.props.smartcrud[this.key].data : []
        this.props.smartcrud[this.key].data.map((row) => {
            if (typeof row.__select__ === 'boolean' && row.__select__ === true) {
                this.setRowSelection(row, false)
            }
            return null
        })
        if (data.length) {
            this.props.updateDatatableRow(this.key, data[0])
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState((state) => {
            const ns = { ...state }
            ns.columns.unshift({
                selector: '__row__',
                name: 'ردیف',
                grow: 1,
                cell: () => {
                    return this.row++ + this.state.limit * this.state.current_page - this.state.limit
                },
            })
            if (this.props.selectable) {
                ns.columns.unshift({
                    selector: '__select__',
                    name: 'انتخاب',
                    grow: 1,
                    cell: (row) => {
                        let isDisabled = false
                        if (typeof this.props.isDisabledSelection === 'function') {
                            isDisabled = this.props.isDisabledSelection(row)
                            if (typeof isDisabled !== 'boolean') {
                                console.error('isDisabledSelection prop must be return boolean [true|false]')
                            }
                        }
                        if (typeof row.__select__ === 'undefined') {
                            row.__select__ = false
                        }

                        row.select = () => {
                            this.setRowSelection(row, true)
                        }
                        row.deselect = () => {
                            this.setRowSelection(row, false)
                        }

                        row.deselectAll = () => {
                            this.deselectAllRows()
                        }

                        return <Checkbox color="primary" disabled={isDisabled} checked={row.__select__} onChange={this.onChangeCheckboxSelection(row)} />
                    },
                })
            }
            if (this.props.moreItems || this.props.editable || this.props.deletable) {
                ns.columns.push({
                    name: 'عملیات',
                    selector: '__more_items__',
                    grow: 1,
                    cell: (row) => {
                        let moreItems = []
                        if (this.props.inputs && this.props.inputs.length && this.props.editable) {
                            moreItems.push({
                                disabled: false,
                                label: 'ویرایش',
                                icon: <EditIcon />,
                                action: () => {
                                    this.props.onEdit(row)
                                },
                            })
                        }

                        if (this.props.morphMany && this.props.morphMany.filter((item) => item.toLowerCase() === 'tags').length > 0) {
                            moreItems.push({
                                disabled: false,
                                label: 'مدیریت تگ ها',
                                icon: <i className="feather icon-tag text-success"></i>,
                                action: () => {
                                    this.morphManyRelations.tags.open(this.props.morphMapKey, row)
                                },
                            })
                        }

                        if (this.props.inputs && this.props.inputs.length && this.props.deletable) {
                            moreItems.push({
                                disabled: false,
                                label: 'حذف',
                                icon: <DeleteIcon color="error" />,
                                action: () => {
                                    this.props.onDelete(row)
                                },
                            })
                        }

                        if (this.props.moreItems) {
                            let customMoreItems = this.props.moreItems(row)
                            customMoreItems.reverse().map((item) => moreItems.unshift(item))
                        }
                        if (moreItems.length) return <MoreItems items={moreItems} />
                    },
                })
            }
            return ns
        })
    }

    async componentDidMount() {
        this.row = 1

        for (let key in this.props.filters) {
            let item = this.props.filters[key]
            if (item.defaultValue) {
                switch (item.type) {
                    case 'text':
                        break
                    case 'number':
                        break
                    case 'select':
                        break
                    case 'multiple_select':
                        break
                    case 'date':
                    case 'datetime':
                        let from_datetime_selector = item.selector + '_from'
                        let to_datetime_selector = item.selector + '_to'

                        await this.setState((state) => {
                            const ns = { ...state }
                            ns.dates_value[item.type][from_datetime_selector] = item.defaultValue.from
                            ns.dates_value[item.type][to_datetime_selector] = item.defaultValue.to
                            return ns
                        })
                        break
                    case 'time':
                        break
                    default:
                        break
                }
            }
        }

        await this.setFilterDataIntoFilterItems()

        this.release()

        $('.tab-content').css({
            padding: '0',
            backgroundColor: 'transparent',
            boxShadow: 'unset',
        })
    }

    resetPagination = () => {
        this.setState((state) => {
            const ns = { ...state }
            ns.current_page = 1
            return ns
        })

        this.props.setDTPaginationTo(this.state.key, 1)
        this.row = 1
    }

    onChangePage = async (page) => {
        await this.setState((state) => {
            const ns = { ...state }
            ns.current_page = page
            return ns
        })
        this.row = 1
        this.release()
    }

    onSearchKeyUp = (event) => {
        let value = event.target.value

        if (value.length > 0) {
            $('.dsibt_clear').stop().fadeIn(200)
        } else {
            $('.dsibt_clear').stop().fadeOut(200)
        }

        // console.log(this.getItem('search'))
        let nonValueSearchCondition = this.getItem('search') !== value && value.length === 0
        if (nonValueSearchCondition || event.keyCode === 13) {
            this.search()
        }
    }

    onChangeSearchInput = (event) => {
        let value = event.target.value
        let valueWithOutSpace = value.replace(/ /g, '')

        if (!isNaN(valueWithOutSpace)) {
            event.target.value = valueWithOutSpace
        }
    }

    search = async () => {
        await this.resetPagination()

        let searchString = this.ref.search.value
        if (searchString.length) {
            let searchData = this.props.columns
                .filter((item) => item.searchable)
                .map((item) => {
                    return [item.selector, 'like', '%' + searchString + '%']
                })
            this.setItem('search', [searchData])
        } else {
            this.removeItem('search')
        }
        this.release()
    }

    clearSearch = async () => {
        await this.resetPagination()
        $('.dsibt_clear').stop().fadeOut()

        let searchString = this.ref.search.value
        if (searchString.length) {
            this.ref.search.value = ''
            await this.removeItem('search')
            this.release()
        }
    }

    onChangeSelect = (selector) => async (value) => {
        await this.setState((state) => {
            const ns = { ...state }
            ns.selects_value[selector] = value.target.value
            return ns
        })

        this.checkCanFilter()
    }

    onChangeMultipleSelect = (selector, items) => async (event) => {
        let selected_values = event.target.value
        await this.setState((state) => {
            const ns = { ...state }
            if (typeof ns.multiple_selects_value[selector] !== 'object') {
                ns.multiple_selects_value[selector] = []
            }

            ns.multiple_selects_value[selector] = selected_values.map((selected_value) => {
                return items.filter((item) => item.value === selected_value)[0]
            })

            return ns
        })

        this.checkCanFilter()
    }

    onChangeStringInputs = (selector) => async (element) => {
        let value = element.target.value
        let valueWithOutSpace = value.replace(/ /g, '')

        if (element.keyCode === 13 && this.state.canFilter) {
            return this.filter()
        }

        await this.setState((state) => {
            const ns = { ...state }
            if (!isNaN(valueWithOutSpace)) {
                ns.strings_value[selector] = valueWithOutSpace
            } else {
                ns.strings_value[selector] = value
            }
            return ns
        })

        this.checkCanFilter()
    }

    onChangeCheckbox = (selector) => async (value) => {
        await this.setState((state) => {
            const ns = { ...state }
            ns.checkboxes_value[selector] = value
            return ns
        })

        this.checkCanFilter()
    }

    activeShrink = (selector) => (e) => {
        this.setState((state) => {
            const ns = { ...state }
            ns.shrink[selector] = true
            return ns
        })
    }

    deactivateShrink = (selector) => (e) => {
        this.setState((state) => {
            const ns = { ...state }
            ns.shrink[selector] = false
            return ns
        })
    }

    onChangeDatePicker = (selector, type) => async (value) => {
        await this.setState((state) => {
            const ns = { ...state }
            ns.dates_value[type][selector] = value
            return ns
        })

        this.checkCanFilter()
    }

    onChangeNumberInputs = (selector) => async (event) => {
        let value = event.target.value
        value = value.toEnglishDigits()
        value = value.replace(/[^0-9]/g, '')
        value = Number33(value)

        if (event.keyCode === 13) {
            return this.filter()
        }

        await this.setState((state) => {
            const ns = { ...state }
            ns.numbers_value[selector] = value
            return ns
        })

        this.checkCanFilter()
    }

    setFilterDataIntoFilterItems = async () => {
        this.filterItems = []
        // Set String Values
        for (let selector in this.state.strings_value) {
            let value = this.state.strings_value[selector]
            if (value) {
                this.setItem(selector, value)
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.numbers_value) {
            let value = this.state.numbers_value[selector]

            if (value) {
                value = value.toEnglishDigits()
                value = value.replace(/[^0-9]/g, '')
                this.setItem(selector, value)
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.selects_value) {
            let value = this.state.selects_value[selector]
            if (selector && value) {
                this.setItem(selector, value)
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.multiple_selects_value) {
            let value = this.state.multiple_selects_value[selector]
            if (selector && value && value.length > 0) {
                let data = value.map((option) => option.value)
                data = data.length > 1 ? [data] : data
                this.setItem(selector, data)
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.dates_value.date) {
            let value = this.state.dates_value.date[selector]
            if (selector && value) {
                let val
                if (/_to$/.test(selector)) {
                    val = value.format('YYYY-MM-DD 23:59:59')
                } else {
                    val = value.format('YYYY-MM-DD 00:00:00')
                }
                this.setItem(selector, val)
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.dates_value.datetime) {
            let value = this.state.dates_value.datetime[selector]
            if (selector && value) {
                this.setItem(selector, value.format('YYYY-MM-DD_HH:mm:ss'))
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.dates_value.time) {
            let value = this.state.dates_value.time[selector]
            if (selector && value) {
                this.setItem(selector, value.format('HH:mm'))
            } else {
                this.removeItem(selector)
            }
        }

        for (let selector in this.state.checkboxes_value) {
            let value = this.state.checkboxes_value[selector]
            if (selector && value) {
                this.setItem(selector, value ? 'asc' : 'desc')
            } else {
                this.removeItem(selector)
            }
        }
    }

    filter = async () => {
        this.filterItems = []
        this.setFilterDataIntoFilterItems()

        await this.resetPagination()

        this.release()

        this.toggleShowFilters()

        this.checkCanFilter()
    }

    filterWithEnter = (e) => {
        if (e.keyCode === 13 && this.state.canFilter) this.filter()
    }

    removeFilters = () => {
        let allQuerys = this.filterItems

        let needToRefresh = allQuerys.length > 0

        allQuerys.forEach((item) => {
            if (item.key !== 'search') {
                this.removeItem(item.key)
            }
        })

        for (let selector in this.state.numbers_value) {
            if (selector) {
                this.setState((state) => {
                    const ns = { ...state }
                    ns.numbers_value[selector] = ''
                    return ns
                })
            }
        }

        for (let selector in this.state.strings_value) {
            if (selector) {
                this.setState((state) => {
                    const ns = { ...state }
                    ns.strings_value[selector] = ''
                    return ns
                })
            }
        }

        for (let selector in this.state.selects_value) {
            if (selector) {
                this.setState((state) => {
                    const ns = { ...state }
                    ns.selects_value[selector] = ''
                    return ns
                })
            }
        }

        for (let selector in this.state.multiple_selects_value) {
            if (selector) {
                this.setState((state) => {
                    const ns = { ...state }
                    ns.multiple_selects_value[selector] = []
                    return ns
                })
            }
        }

        this.setState((state) => {
            const ns = { ...state }
            ns.checkboxes_value = {}
            ns.dates_value = {
                datetime: {},
                date: {},
                time: {},
            }
            ns.canFilter = false
            return ns
        })

        if (needToRefresh) {
            this.resetPagination()
            this.release()
            this.toggleShowFilters()
        }
    }

    changeLimit = async (limit) => {
        await this.resetPagination()
        await this.setState((state) => {
            const ns = { ...state }
            ns.limit = limit
            return ns
        })

        await this.release()

        this.setState((state) => {
            const ns = { ...state }

            ns.limit = limit

            ns.columns = state.columns.filter((item) => item.selector !== '__row__')

            ns.columns.unshift({
                selector: '__row__',
                name: 'ردیف',
                grow: 1,
                cell: () => {
                    return this.row++ + limit * this.state.current_page - limit
                },
            })
            return ns
        })
    }

    toggleShowFilters = (e) => {
        this.setState((state) => {
            const ns = { ...state }
            ns.openFilters = !state.openFilters
            return ns
        })
    }

    printDialog = () => {
        if (this.props.smartcrud[this.state.key].total_page <= 5) {
            return this.print()
        }

        Dialog({
            yes: 'تایید / شروع عملیات',
            no: 'خیر',
            title: ' چاپ ' + (this.props.title || 'لیست اطلاعات'),
            description: ' انجام این عملیات یک فرایند زمانبر میباشد (تا چند دقیقه) ، آیا از انجام این عملیات اطمینان دارید ؟ ',

            onAccept: () => {
                this.print()
            },
            onDenied: () => {},
        })
    }

    exportDialog = () => {
        if (this.props.smartcrud[this.state.key].total_page <= 5) {
            return this.export()
        }

        Dialog({
            yes: 'تایید / شروع عملیات',
            no: 'خیر',
            title: ' خروجی ' + (this.props.title || 'لیست اطلاعات'),
            description: ' انجام این عملیات یک فرایند زمانبر میباشد (تا چند دقیقه) ، آیا از انجام این عملیات اطمینان دارید ؟ ',

            onAccept: () => {
                this.export()
            },
            onDenied: () => {},
        })
    }

    print = () => {
        this.row = 1

        this.setState((state) => {
            const ns = { ...state }
            ns.print.started = true
            ns.print.data = []
            ns.current_page = 1
            return ns
        })

        let queryString = this.generateQueryString(1, 5000)

        this.props.axios
            .get(this.state.route + queryString)
            .then((response) => {
                let results

                if (this.props.mutators && this.props.mutators.onLoad && typeof this.props.mutators.onLoad === 'function') {
                    results = this.props.mutators.onLoad({ ...response })
                } else {
                    results = response.data.results || response.data.data
                }

                this.setState((state) => {
                    const ns = { ...state }
                    ns.print.started = false
                    ns.print.data = results.data
                    return ns
                })

                var printWindow = window.open('', 'PRINT', 'height=1018,width=800')

                printWindow.document.write('<html><head><title>' + document.title + '</title>')
                printWindow.document.write(`<style rel="stylesheet">${printStyles}</style>`)
                printWindow.document.write('</head><body >')
                printWindow.document.write(document.getElementById('print_content' + this.state.key).innerHTML)

                printWindow.document.write('</body></html>')
                setTimeout(() => {
                    printWindow.print()
                    printWindow.close()
                    this.setState((state) => {
                        const ns = { ...state }
                        ns.print.data = []
                        return ns
                    })
                }, 2000)
            })
            .catch((error) => {
                DangerAlert('عملیات با شکست مواجه شد')
                this.setState((state) => {
                    const ns = { ...state }
                    ns.print.started = false
                    return ns
                })
            })
    }

    export = () => {
        this.row = 1

        this.setState((state) => {
            const ns = { ...state }
            ns.export.started = true
            ns.export.data = []
            ns.current_page = 1
            return ns
        })

        let queryString = this.generateQueryString(1, 5000)

        this.props.axios
            .get(this.state.route + queryString)
            .then(async (response) => {
                let results

                if (this.props.mutators && this.props.mutators.onLoad && typeof this.props.mutators.onLoad === 'function') {
                    results = this.props.mutators.onLoad({ ...response })
                } else {
                    results = response.data.results || response.data.data
                }
                let rowId = 1
                let data = results.data.map((row) => {
                    let output = { ردیف: rowId++ }
                    this.props.columns
                        .filter((column) => column.exportable !== false)
                        .map((column) => {
                            if (column.cell) {
                                output[column.name] = column.cell(row)
                            } else {
                                output[column.name] = select(column.selector, row)
                            }

                            for (let index in output) {
                                let item = output[index]
                                if (item && typeof item === 'object' && item.$$typeof) {
                                    output[index] = item.props.children
                                }
                            }

                            return null
                        })
                    return output
                })
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.export.started = false
                    ns.export.data = data
                    return ns
                })

                document.getElementById('SM_CSVLink').click()
            })
            .catch((err) => {
                DangerAlert('عملیات با شکست مواجه شد')
                this.setState((state) => {
                    const ns = { ...state }
                    ns.export.started = false
                    ns.export.data = []
                    return ns
                })
            })
    }

    revertFilter = (column) => async () => {
        switch (column.type) {
            case 'text':
                let string_key = column.selector
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== string_key)
                    ns.strings_value[string_key] = ''
                    return ns
                })
                await this.removeItem(string_key)
                break
            case 'number':
                let number_key = column.selector
                let number_key_from = column.selector + '_from'
                let number_key_to = column.selector + '_to'
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== number_key)
                    ns.numbers_value[number_key_from] = ''
                    ns.numbers_value[number_key_to] = ''
                    return ns
                })
                await this.removeItem(number_key_from)
                await this.removeItem(number_key_to)
                break
            case 'select':
                let select_key = column.selector
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== select_key)
                    ns.selects_value[select_key] = ''
                    return ns
                })
                await this.removeItem(select_key)
                break
            case 'multiple_select':
                let multiple_selects_key = column.selector
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== multiple_selects_key)
                    ns.multiple_selects_value[multiple_selects_key] = ''
                    return ns
                })
                await this.removeItem(multiple_selects_key)
                break
            case 'date':
                let date_key = column.selector
                let date_key_from = column.selector + '_from'
                let date_key_to = column.selector + '_to'
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== date_key)
                    ns.dates_value.date[date_key_from] = null
                    ns.dates_value.date[date_key_to] = null
                    return ns
                })
                await this.removeItem(date_key_from)
                await this.removeItem(date_key_to)
                break
            case 'datetime':
                let datetime_key = column.selector
                let datetime_key_from = column.selector + '_from'
                let datetime_key_to = column.selector + '_to'
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== datetime_key)
                    ns.dates_value.datetime[datetime_key_from] = null
                    ns.dates_value.datetime[datetime_key_to] = null
                    return ns
                })
                await this.removeItem(datetime_key_from)
                await this.removeItem(datetime_key_to)
                break
            case 'time':
                let time_key = column.selector
                let time_key_from = column.selector + '_from'
                let time_key_to = column.selector + '_to'
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== time_key)
                    ns.dates_value.time[time_key_from] = null
                    ns.dates_value.time[time_key_to] = null
                    return ns
                })
                await this.removeItem(time_key_from)
                await this.removeItem(time_key_to)
                break
            case 'order_by':
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== 'order_by' && item.key !== 'order_by_type')
                    ns.selects_value['order_by'] = ''
                    ns.checkboxes_value['order_by_type'] = false
                    return ns
                })
                await this.removeItem('order_by')
                await this.removeItem('order_by_type')
                break
            case 'merchant':
                await this.removeItem('merchant')
                await this.setState((state) => {
                    const ns = { ...state }
                    ns.useFilters = state.useFilters.filter((item) => item.key !== 'merchant')
                    ns.multiple_selects_value['merchant'] = ''
                    return ns
                })
                break
            default:
                break
        }

        if (this.state.useFilters.length === 0) {
            this.filter()
        }
    }

    refresh = async () => {
        await this.resetPagination()
        this.release()
    }

    stableRefresh = async () => {
        // await this.resetPagination()
        this.release()
    }

    onChangeOrderBy = (e) => {
        let orderBy = e.target.value
        this.setState((state) => {
            const ns = { ...state }
            ns.order_by = orderBy
            ns.canFilter = true
            return ns
        })
    }

    onChangeOrderByType = (value) => {
        this.setState((state) => {
            const ns = { ...state }
            ns.order_by_type = value ? 'asc' : 'desc'
            ns.canFilter = true
            return ns
        })
    }

    setSummationsModalTo = (to) => () => {
        this.setState((state) => {
            const ns = { ...state }
            ns.summationsModal = to
            return ns
        })
    }

    renderSummationsModal() {
        return (
            <Modal className="sc-modal-wrapper" open={this.state.summationsModal} onClose={this.setSummationsModalTo(false)}>
                <Box className="sc-modal-inner">
                    <div className="sc-modal-header">
                        <div className="sc-modal-title">مجموع</div>
                    </div>
                    <div className="sc-modal-body">
                        <Box p={3}>
                            <div className="dt_summations_wrapper">
                                {this.props.summations && this.props.smartcrud[this.key] && this.props.smartcrud[this.key].summations
                                    ? this.props.summations.map((item, index) => {
                                          return (
                                              <div className="dt_summations_item" key={index}>
                                                  <span className="dt_summations_title">{item.title} : </span>
                                                  <span className="dt_summations_value">
                                                      {Number33(this.props.smartcrud[this.key].summations[item.key] || 0)}
                                                      <span className="dt_summations_unit">{item.unit}</span>
                                                  </span>
                                              </div>
                                          )
                                      })
                                    : null}
                            </div>
                        </Box>
                    </div>
                    <div className="sc-modal-footer justify-content-center">
                        <UIButton variant="contained" className="mr-2 shadow-0" color="default" onClick={this.setSummationsModalTo(false)}>
                            بستن
                        </UIButton>
                    </div>
                </Box>
            </Modal>
        )
    }

    renderMorphManyRelations() {
        return (
            <Fragment>
                {this.props.morphMany && this.props.morphMany.filter((item) => item.toLowerCase() === 'tags').length > 0 ? (
                    <Tags {...this.props} ref={(ref) => (this.morphManyRelations.tags = ref)} />
                ) : null}
                {this.props.morphMany && this.props.morphMany.filter((item) => item.toLowerCase() === 'attachments').length > 0 ? (
                    <Attachments {...this.props} ref={(ref) => (this.morphManyRelations.attachments = ref)} />
                ) : null}
            </Fragment>
        )
    }

    render() {
        let sortByIsChecked = this.state.order_by_type === 'asc'
        const ITEM_HEIGHT = 48
        const ITEM_PADDING_TOP = 8
        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        }

        this.row = 1
        let printColumns = this.state.columns.filter((item) => item.selector !== '__more_items__' && item.selector !== '__select__')
        const DataTableComponent = this.props.smartcrud.config.datatable

        if (!DataTableComponent) return <h1 className="text-danger">Datatable not loaded</h1>
        return (
            <Fragment>
                {this.renderSummationsModal()}
                {this.renderMorphManyRelations()}
                <div className="hide" id={'print_content' + this.state.key}>
                    <DatatableBaseComponent title={this.props.title || 'لیست اطلاعات'} data={this.state.print.data} columns={printColumns} />
                </div>
                <div className="custom_datatable_wrapper">
                    <div className={'custom_datatable_filter ' + (this.state.openFilters ? 'openFilters' : '')}>
                        <UIButton className="dt_close_btn" onClick={this.toggleShowFilters}>
                            <CloseRoundedIcon />
                        </UIButton>
                        <div className="filter_section_wrapper">
                            <div className="filter_section">
                                <div className="dt_used_filters">
                                    {this.state.useFilters.map((filter, index) => {
                                        let column = this.props.filters.filter((col) => col.selector === filter.key)[0]
                                        if (column) {
                                            let name = column.label
                                            return (
                                                <UIButton key={index} className="dt_used_item" onClick={this.revertFilter(column)}>
                                                    <span>{'' + name + ''}</span>
                                                    <span>
                                                        <CloseRoundedIcon />
                                                    </span>
                                                </UIButton>
                                            )
                                        }

                                        if (filter.key === 'order_by' || filter.key === 'order_by_type') {
                                            return (
                                                <UIButton key={index} className="dt_used_item" onClick={this.revertFilter({ type: 'order_by' })}>
                                                    <span>{' ترتیب نمایش '}</span>
                                                    <span>
                                                        <CloseRoundedIcon />
                                                    </span>
                                                </UIButton>
                                            )
                                        }

                                        if (filter.key === 'merchant') {
                                            return (
                                                <UIButton key={index} className="dt_used_item" onClick={this.revertFilter({ type: 'merchant' })}>
                                                    <span>{' شعبه '}</span>
                                                    <span>
                                                        <CloseRoundedIcon />
                                                    </span>
                                                </UIButton>
                                            )
                                        }

                                        return null
                                    })}
                                </div>
                                {this.props.columns.filter((item) => item.sortableFilter).length ? (
                                    <div className="dt_order_by">
                                        <Grid container spacing={3}>
                                            <Grid item xs={2}>
                                                <Tooltip
                                                    enterDelay={1000}
                                                    title={sortByIsChecked ? 'کوچک به بزرگ' : 'بزرگ به کوچک'}
                                                    placement="top"
                                                    arrow
                                                    TransitionComponent={Zoom}
                                                >
                                                    <div className="order_by_type">
                                                        <Switch
                                                            checked={sortByIsChecked}
                                                            onColor="#2196f3"
                                                            offColor="#e0e0e0"
                                                            onChange={this.onChangeOrderByType}
                                                            uncheckedIcon={<SortIcon className="order_by_type_desc_icon" />}
                                                            checkedIcon={<SortIcon className="order_by_type_asc_icon" />}
                                                        />
                                                    </div>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <FormControl className="width-100">
                                                    <InputLabel id="dt_filter_select_box_order_by">مرتب سازی بر اساس</InputLabel>
                                                    <Select
                                                        labelId="dt_filter_select_box_order_by"
                                                        label="مرتب سازی بر اساس"
                                                        value={this.state.order_by}
                                                        onChange={this.onChangeOrderBy}
                                                        className="dt_filter_selectbox"
                                                    >
                                                        {this.props.columns
                                                            .filter((item) => item.sortableFilter)
                                                            .map((option, index) => {
                                                                return (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={option.selector ? option.selector : ''}
                                                                        className="text-center"
                                                                    >
                                                                        {option.name}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </div>
                                ) : null}
                                <div className="filter_serction_items">
                                    {this.props.filters.map((item, key) => {
                                        // item.selector = item.selector.split('.').reverse()[0];
                                        switch (item.type) {
                                            case 'text':
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                className="mui_datatable_search_input"
                                                                margin="dense"
                                                                variant="filled"
                                                                onFocus={this.activeShrink(item.selector)}
                                                                onBlur={this.deactivateShrink(item.selector)}
                                                                InputLabelProps={{
                                                                    shrink:
                                                                        this.state.strings_value[item.selector] || this.state.shrink[item.selector]
                                                                            ? true
                                                                            : false,
                                                                }}
                                                                label={item.label}
                                                                onChange={this.onChangeStringInputs(item.selector)}
                                                                onKeyUp={this.filterWithEnter}
                                                                value={this.state.strings_value[item.selector] || ''}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )
                                            case 'number':
                                                let from_selector = item.selector + '_from'
                                                let to_selector = item.selector + '_to'
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                className="mui_datatable_search_input"
                                                                margin="dense"
                                                                onFocus={this.activeShrink(from_selector)}
                                                                onBlur={this.deactivateShrink(from_selector)}
                                                                InputLabelProps={{
                                                                    shrink:
                                                                        this.state.numbers_value[from_selector] || this.state.shrink[from_selector]
                                                                            ? true
                                                                            : false,
                                                                }}
                                                                onChange={this.onChangeNumberInputs(from_selector)}
                                                                value={this.state.numbers_value[from_selector] || ''}
                                                                onKeyUp={this.filterWithEnter}
                                                                label={'از ' + item.label}
                                                                variant="filled"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                onChange={this.onChangeNumberInputs(to_selector)}
                                                                value={this.state.numbers_value[to_selector] || ''}
                                                                className="mui_datatable_search_input"
                                                                margin="dense"
                                                                onFocus={this.activeShrink(to_selector)}
                                                                onBlur={this.deactivateShrink(to_selector)}
                                                                onKeyUp={this.filterWithEnter}
                                                                InputLabelProps={{
                                                                    shrink:
                                                                        this.state.numbers_value[to_selector] || this.state.shrink[to_selector] ? true : false,
                                                                }}
                                                                label={'تا ' + item.label}
                                                                variant="filled"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )
                                            case 'select':
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <Grid item xs={12}>
                                                            <FormControl className="width-100">
                                                                <InputLabel id={'dt_filter_select_box_' + item.selector}>{item.label}</InputLabel>
                                                                <Select
                                                                    labelId={'dt_filter_select_box_' + item.selector}
                                                                    label={item.label}
                                                                    value={
                                                                        this.state.selects_value[item.selector] ? this.state.selects_value[item.selector] : ''
                                                                    }
                                                                    onChange={this.onChangeSelect(item.selector)}
                                                                    className="dt_filter_selectbox"
                                                                >
                                                                    {/* <MenuItem value="" className="text-center">هیچکدام</MenuItem> */}
                                                                    {item.items.map((option, index) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={index}
                                                                                value={option.value ? option.value : ''}
                                                                                className="text-center"
                                                                            >
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                )
                                            case 'multiple_select':
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <Grid item xs={12}>
                                                            <FormControl className="width-100">
                                                                <InputLabel id={'dt_filter_multiple_select_box_' + item.selector}>{item.label}</InputLabel>
                                                                <Select
                                                                    labelId={'dt_filter_multiple_select_box_' + item.selector}
                                                                    id={'dt_filter_multiple_select_item_' + item.selector}
                                                                    multiple
                                                                    value={
                                                                        this.state.multiple_selects_value[item.selector]
                                                                            ? this.state.multiple_selects_value[item.selector].map(
                                                                                  (selectedItem) => selectedItem.value
                                                                              )
                                                                            : []
                                                                    }
                                                                    onChange={this.onChangeMultipleSelect(item.selector, item.items)}
                                                                    input={<Input id={'dt_filter_multiple_select_item_' + item.selector} />}
                                                                    renderValue={(selectedItems) => (
                                                                        <div>
                                                                            {selectedItems.map((selectedItem) => {
                                                                                let optionData = item.items.filter((option) => option.value === selectedItem)[0]
                                                                                return <Chip key={optionData.value} label={optionData.label} />
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                    MenuProps={MenuProps}
                                                                >
                                                                    {item.items.map((option, index) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={index}
                                                                                name={option.label}
                                                                                value={option.value ? option.value : ''}
                                                                                className="text-center"
                                                                            >
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                )
                                            case 'date':
                                                let from_date_selector = item.selector + '_from'
                                                let to_date_selector = item.selector + '_to'
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                                                            <Grid item xs={6}>
                                                                <DatePicker
                                                                    autoOk
                                                                    disableToolbar
                                                                    onOpen={this.activeShrink(from_date_selector)}
                                                                    onClose={this.deactivateShrink(from_date_selector)}
                                                                    variant={item.variant || 'inline'}
                                                                    margin="dense"
                                                                    oklabel={this.state.oklabel}
                                                                    cancellabel={this.state.cancellabel}
                                                                    InputLabelProps={{
                                                                        shrink:
                                                                            this.state.dates_value[item.type][from_date_selector] ||
                                                                            this.state.shrink[from_date_selector]
                                                                                ? true
                                                                                : false,
                                                                    }}
                                                                    label={'از ' + item.label}
                                                                    labelFunc={(date) => (date ? date.format('jYYYY/jMM/jDD') : '')}
                                                                    value={this.state.dates_value[item.type][from_date_selector] ?? null}
                                                                    onChange={this.onChangeDatePicker(from_date_selector, item.type)}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <DatePicker
                                                                    autoOk
                                                                    disableToolbar
                                                                    onOpen={this.activeShrink(to_date_selector)}
                                                                    onClose={this.deactivateShrink(to_date_selector)}
                                                                    variant={item.variant || 'inline'}
                                                                    margin="dense"
                                                                    oklabel={this.state.oklabel}
                                                                    cancellabel={this.state.cancellabel}
                                                                    InputLabelProps={{
                                                                        shrink:
                                                                            this.state.dates_value[item.type][to_date_selector] ||
                                                                            this.state.shrink[to_date_selector]
                                                                                ? true
                                                                                : false,
                                                                    }}
                                                                    label={'تا ' + item.label}
                                                                    labelFunc={(date) => (date ? date.format('jYYYY/jMM/jDD') : '')}
                                                                    value={this.state.dates_value[item.type][to_date_selector] ?? null}
                                                                    onChange={this.onChangeDatePicker(to_date_selector, item.type)}
                                                                />
                                                            </Grid>
                                                        </MuiPickersUtilsProvider>
                                                    </Grid>
                                                )
                                            case 'datetime':
                                                let from_datetime_selector = item.selector + '_from'
                                                let to_datetime_selector = item.selector + '_to'
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                                                            <Grid item xs={6}>
                                                                <DateTimePicker
                                                                    autoOk
                                                                    disableToolbar
                                                                    ampm={false}
                                                                    onOpen={this.activeShrink(from_datetime_selector)}
                                                                    onClose={this.deactivateShrink(from_datetime_selector)}
                                                                    InputLabelProps={{
                                                                        shrink:
                                                                            this.state.dates_value[item.type][from_datetime_selector] ||
                                                                            this.state.shrink[from_datetime_selector]
                                                                                ? true
                                                                                : false,
                                                                    }}
                                                                    variant={item.variant || 'inline'}
                                                                    margin="dense"
                                                                    label={'از ' + item.label}
                                                                    labelFunc={(date) => (date ? date.format('jYYYY/jMM/jDD - HH:mm') : '')}
                                                                    value={this.state.dates_value[item.type][from_datetime_selector] ?? null}
                                                                    onChange={this.onChangeDatePicker(from_datetime_selector, item.type)}
                                                                    oklabel={this.state.oklabel}
                                                                    cancellabel={this.state.cancellabel}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <DateTimePicker
                                                                    autoOk
                                                                    disableToolbar
                                                                    ampm={false}
                                                                    onOpen={this.activeShrink(to_datetime_selector)}
                                                                    onClose={this.deactivateShrink(to_datetime_selector)}
                                                                    InputLabelProps={{
                                                                        shrink:
                                                                            this.state.dates_value[item.type][to_datetime_selector] ||
                                                                            this.state.shrink[to_datetime_selector]
                                                                                ? true
                                                                                : false,
                                                                    }}
                                                                    variant={item.variant || 'inline'}
                                                                    margin="dense"
                                                                    label={'تا ' + item.label}
                                                                    labelFunc={(date) => (date ? date.format('jYYYY/jMM/jDD - HH:mm') : '')}
                                                                    value={this.state.dates_value[item.type][to_datetime_selector] ?? null}
                                                                    onChange={this.onChangeDatePicker(to_datetime_selector, item.type)}
                                                                    oklabel={this.state.oklabel}
                                                                    cancellabel={this.state.cancellabel}
                                                                />
                                                            </Grid>
                                                        </MuiPickersUtilsProvider>
                                                    </Grid>
                                                )
                                            case 'time':
                                                let from_time_selector = item.selector + '_from'
                                                let to_time_selector = item.selector + '_to'
                                                return (
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        key={key}
                                                        className="dt_filter_item"
                                                        style={{
                                                            zIndex: this.columns.length - key,
                                                        }}
                                                    >
                                                        <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                                                            <Grid item xs={6}>
                                                                <TimePicker
                                                                    autoOk
                                                                    disableToolbar
                                                                    ampm={false}
                                                                    onOpen={this.activeShrink(from_time_selector)}
                                                                    onClose={this.deactivateShrink(from_time_selector)}
                                                                    InputLabelProps={{
                                                                        shrink:
                                                                            this.state.dates_value[item.type][from_time_selector] ||
                                                                            this.state.shrink[from_time_selector]
                                                                                ? true
                                                                                : false,
                                                                    }}
                                                                    variant={item.variant || 'inline'}
                                                                    margin="dense"
                                                                    label={'از ' + item.label}
                                                                    labelFunc={(date) => (date ? date.format('HH:mm') : '')}
                                                                    value={this.state.dates_value[item.type][from_time_selector] ?? null}
                                                                    onChange={this.onChangeDatePicker(from_time_selector, item.type)}
                                                                    oklabel={this.state.oklabel}
                                                                    cancellabel={this.state.cancellabel}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TimePicker
                                                                    autoOk
                                                                    disableToolbar
                                                                    ampm={false}
                                                                    onOpen={this.activeShrink(to_time_selector)}
                                                                    onClose={this.deactivateShrink(to_time_selector)}
                                                                    InputLabelProps={{
                                                                        shrink:
                                                                            this.state.dates_value[item.type][to_time_selector] ||
                                                                            this.state.shrink[to_time_selector]
                                                                                ? true
                                                                                : false,
                                                                    }}
                                                                    variant={item.variant || 'inline'}
                                                                    hiddenLabel={true}
                                                                    margin="dense"
                                                                    label={'تا ' + item.label}
                                                                    labelFunc={(date) => (date ? date.format('HH:mm') : '')}
                                                                    value={this.state.dates_value[item.type][to_time_selector] ?? null}
                                                                    onChange={this.onChangeDatePicker(to_time_selector, item.type)}
                                                                    oklabel={this.state.oklabel}
                                                                    cancellabel={this.state.cancellabel}
                                                                />
                                                            </Grid>
                                                        </MuiPickersUtilsProvider>
                                                    </Grid>
                                                )
                                            default:
                                                return null
                                        }
                                    })}
                                </div>
                                <div className="filter_section_footer">
                                    <UIButton
                                        variant="contained"
                                        className="dt_filter_btn"
                                        color="primary"
                                        disabled={
                                            !this.state.canFilter ||
                                            (this.props.smartcrud[this.state.key] ? !this.props.smartcrud[this.state.key].loaded : true)
                                        }
                                        onClick={this.filter}
                                    >
                                        <Fragment>اعمال فیلتر </Fragment>
                                        {(this.props.smartcrud[this.state.key] ? !this.props.smartcrud[this.state.key].loaded : true) ? (
                                            <CircularProgress
                                                style={{
                                                    height: 20,
                                                    width: 20,
                                                    marginRight: 10,
                                                }}
                                            />
                                        ) : null}
                                    </UIButton>
                                    <UIButton
                                        variant="contained"
                                        className={'dt_filter_clear ' + (!this.state.canFilter ? 'dontShow' : '')}
                                        color="default"
                                        disabled={this.props.smartcrud[this.state.key] ? !this.props.smartcrud[this.state.key].loaded : true}
                                        onClick={this.removeFilters}
                                    >
                                        <RotateLeftRoundedIcon />
                                    </UIButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'custom_datatable ' + (this.state.openFilters ? 'openFilters' : '')}>
                        <div className="filterWrapper">
                            <div className="page_title_wrapper">
                                <span className="page_title">{this.props.title || 'لیست اطلاعات'}</span>
                                <ProcessStatus />
                            </div>
                            <div className="filterContainer-right">
                                <div className="filterInputContainer" style={{ minWidth: 280 }}>
                                    <TextField
                                        className="mui_datatable_search_input"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <div className="datatable_search_buttons">
                                                        <span className="datatable_serach_inner_button_item dsibt_clear">
                                                            <IconButton className="filter_btn" onClick={this.clearSearch}>
                                                                <ClearIcon className="iconButtons" />
                                                            </IconButton>
                                                        </span>

                                                        <span className="datatable_serach_inner_button_item">
                                                            <IconButton className="filter_btn" onClick={this.search}>
                                                                <SearchIcon className="iconButtons" />
                                                            </IconButton>
                                                        </span>
                                                    </div>
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={this.onChangeSearchInput}
                                        margin="dense"
                                        inputRef={(el) => (this.ref.search = el)}
                                        onKeyUp={this.onSearchKeyUp}
                                        placeholder="جستجو"
                                        variant="outlined"
                                    />
                                </div>
                                <IconButton
                                    id={this.key}
                                    disabled={this.props.smartcrud[this.state.key] ? !this.props.smartcrud[this.state.key].loaded : true}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.refresh}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </div>
                            <div className="filterContainer-left">
                                {this.props.smartcrud[this.state.key] &&
                                this.props.smartcrud[this.state.key].data &&
                                this.props.smartcrud[this.state.key].data.length > 0 ? (
                                    <Fragment>
                                        {this.props.summations && this.props.summations.length > 0 ? (
                                            <IconButton variant="contained" color="primary" onClick={this.setSummationsModalTo(true)}>
                                                <EqualizerRoundedIcon />
                                            </IconButton>
                                        ) : null}
                                        <CSVLink id="SM_CSVLink" data={this.state.export.data} filename={(this.props.title || 'لیست اطلاعات') + '.csv'} />

                                        <IconButton disabled={this.state.export.started} variant="contained" color="primary" onClick={this.exportDialog}>
                                            {this.state.export.started ? (
                                                <CircularProgress
                                                    style={{
                                                        height: 24,
                                                        width: 24,
                                                    }}
                                                />
                                            ) : (
                                                <GetAppIcon />
                                            )}
                                        </IconButton>

                                        <IconButton disabled={this.state.print.started} variant="contained" color="primary" onClick={this.printDialog}>
                                            {this.state.print.started ? (
                                                <CircularProgress
                                                    style={{
                                                        height: 24,
                                                        width: 24,
                                                    }}
                                                />
                                            ) : (
                                                <PrintIcon />
                                            )}
                                        </IconButton>
                                    </Fragment>
                                ) : null}

                                {this.props.columns.filter((item) => item.sortableFilter).length || (this.props.filters && this.props.filters.length) ? (
                                    <UIButton
                                        variant="contained"
                                        color="primary"
                                        className="mui_filter_btn mr-2"
                                        onClick={this.toggleShowFilters}
                                        startIcon={<i className="feather icon-filter"></i>}
                                    >
                                        {this.state.useFilters.length > 0 ? <span className="dt_filters_count">{this.state.useFilters.length}</span> : ''}
                                        <span> فیلتر </span>
                                    </UIButton>
                                ) : null}
                            </div>
                        </div>

                        <DatatableBaseComponent
                            progressComponent={<LoadingList />}
                            highlightOnHover
                            title="لیست اطلاعات"
                            fixedHeader={true}
                            fixedHeaderScrollHeight="50vh"
                            {...this.props}
                            data={this.props.smartcrud[this.state.key] ? this.props.smartcrud[this.state.key].data : []}
                            progressPending={this.props.smartcrud[this.state.key] ? !this.props.smartcrud[this.state.key].loaded : true}
                            noHeader={true}
                            columns={this.state.columns}
                            noDataComponent={<NoDataComponent title={this.props.noDataTitle || 'هیچ اطلاعاتی موجود نیست'} />}
                        />
                        <Pagination
                            accessibilityKey={this.state.key}
                            lastPage={this.props.smartcrud[this.state.key] ? this.props.smartcrud[this.state.key].total_page : null}
                            onChangeLimit={this.changeLimit}
                            totalItem={this.props.smartcrud[this.state.key] ? this.props.smartcrud[this.state.key].total_item : null}
                            progressPending={this.props.smartcrud[this.state.key] ? !this.props.smartcrud[this.state.key].loaded : true}
                            onChangePage={this.onChangePage}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    panel: state.panel,
    smartcrud: state.smartcrud,
    config: state.smartcrud.config,
    axios: state.smartcrud.config.axios,
})

const mapDispatchToProps = (dispatch) => ({
    setDTPaginationTo: (key, page) => dispatch(setDTPaginationTo(key, page)),
    getData: (request, mutator = null) => dispatch(getFromSmartCrud(request, mutator)),
    getMerchants: (onSuccess = () => {}) => dispatch(getMerchants(onSuccess)),
    updateDatatableRow: (key, row) => dispatch(updateDatatableRow(key, row)),
})

SmartCrudDataTable.propTypes = {
    title: PropTypes.string,
    noDataTitle: PropTypes.string,
    columns: PropTypes.array,
    filters: PropTypes.array,
    append: PropTypes.array,
    relations: PropTypes.array,
    route: PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
})(SmartCrudDataTable)
