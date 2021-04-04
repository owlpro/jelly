import store from './../Redux/store'
import moment from 'jalali-moment'
import { openDialog } from '../Redux/action'

export const select = (selector, object) => {
    let splitedSelector = selector.split('.')

    if (splitedSelector.length > 1) {
        let selectingObject = { ...object }

        splitedSelector.forEach((selectorItem) => {
            if (selectingObject && selectingObject.hasOwnProperty(selectorItem)) {
                selectingObject = selectingObject[selectorItem]
            }
        })
        return selectingObject
    }

    return object.hasOwnProperty(selector) ? object[selector] : null
}
export const setToObject = (selector, value, object) => {
    // let insertingObject = {...object};
    let splitedSelector = selector.split('.')
    // console.log(selector, value, insertingObject);

    if (splitedSelector.length > 1) {
        let workingObject = object

        splitedSelector.forEach((selectorItem, index) => {
            let isLastItem = index === splitedSelector.length - 1

            if (!workingObject.hasOwnProperty(selectorItem) && !isLastItem) {
                workingObject[selectorItem] = {}
            }

            if (isLastItem) {
                workingObject[selectorItem] = value
            }

            workingObject = workingObject[selectorItem]
        })

        return object
    }

    object[selector] = value
    return object
}

export const unique = (names) => {
    let unique = {}
    names.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true
        }
    })
    return Object.keys(unique)
}

export const RandomStr = (length) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export const humanFileSize = (bytes, si = true, dp = 1) => {
    const thresh = si ? 1000 : 1024

    if (Math.abs(bytes) < thresh) {
        return bytes + ' بایت'
    }

    const units = si ? ['کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    let u = -1
    const r = 10 ** dp

    do {
        bytes /= thresh
        ++u
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

    return bytes.toFixed(dp) + ' ' + units[u]
}

export const routeToKey = (route) => {
    return route.replace(/^http:\/\/|^https:\/\/|[:\/]/gim, '_')
}

export const Number33 = (value) => {
    if (value) {
        let objRegex = new RegExp('(-?[0-9]+)([0-9]{3})')
        let val = value.toString().replace(/,/gi, '')
        while (objRegex.test(val)) {
            val = val.replace(objRegex, '$1,$2')
        }
        return val
    }
    return 0
}
export const Number44 = (value) => {
    let objRegex = new RegExp('(-?[0-9]+)([0-9]{4})')
    let val = value.toString().replace(/ /gi, '')
    while (objRegex.test(val)) {
        val = val.replace(objRegex, '$1 $2')
    }
    return val
}

export const Dialog = (config = {}) => {
    config.yes = config.yes ? config.yes : 'بله'
    config.no = config.no ? config.no : 'خیر'
    config.title = config.title ? config.title : 'تاییدیه'
    config.description = config.description ? config.description : 'از این عملیات اطمنینان دارید ؟'
    config.onAccept = config.onAccept
        ? config.onAccept
        : () => {
              // console.log('تایید شد')
          }
    config.onDenied = config.onDenied ? config.onDenied : () => {}

    store.dispatch(openDialog(config))
}

export const e2p = (s) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
export const e2a = (s) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])

export const p2e = (s) => s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
export const a2e = (s) => s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))

export const p2a = (s) => s.replace(/[۰-۹]/g, (d) => '٠١٢٣٤٥٦٧٨٩'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
export const a2p = (s) => s.replace(/[٠-٩]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])

export const UcFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const toJalaliDate = (datetime) => {
    return moment(datetime, 'YYYY/MM/DD HH:mm:ss').locale('fa').format('DD MMMM YYYY - HH:mm')
}
