import { store } from "react-notifications-component";


const Alert = (type, title, message) => {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "zoomOut"],
        dismiss: {
            duration: 6000,
            onScreen: true
        }
    });
};

export const WarningAlert = (title, message) => {
    Alert("warning", title, message);
};
export const DangerAlert = (title, message) => {
    Alert("danger", title, message);
};
export const SuccessAlert = (title, message) => {
    Alert("success", title, message);
};
export const InfoAlert = (title, message) => {
    Alert("info", title, message);
};
export const PrimaryAlert = (title, message) => {
    Alert("default", title, message);
};

export default Alert;
