import { setPageLoadingTo } from '../Redux/action'
import store from './../Redux/store'

const Alert = (type, title, message) => {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        container: 'top-center',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'zoomOut'],
        dismiss: {
            duration: 6000,
            onScreen: true,
        },
    })
}

export const WarningAlert = (message) => {
    store.dispatch(setPageLoadingTo(false, message, 'warning'))
}
export const DangerAlert = (message) => {
    store.dispatch(setPageLoadingTo(false, message, 'failed'))
}
export const SuccessAlert = (message) => {
    store.dispatch(setPageLoadingTo(false, message, 'success'))
}
export const InfoAlert = (message) => {
    store.dispatch(setPageLoadingTo(false, message, 'info'))
}

export default Alert
