import axiosInstance from 'axios'

const axios = axiosInstance.create({
    baseURL: "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'fa',
    },
})
let token = localStorage.getItem('loginToken')
if (token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token
}

export default axios
