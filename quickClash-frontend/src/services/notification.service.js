import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class NotificationService {
    createNotification(data) {
        return axios.post(API_URL + 'notification', data)
    }

    getSenderNotification(id) {
        return axios.get(API_URL + `notification/sender/${id}`)
    }

    getReceiverNotification(id) {
        return axios.get(API_URL + `notification/receiver/${id}`)
    }

    deleteReceiverNotification(id) {
        return axios.post(API_URL + `notification/receiver/delete/${id}`)
    }

    deleteSenderNotification(id) {
        return axios.post(API_URL + `notification/sender/delete/${id}`)
    }

    deleteNotification(id) {
        return axios.post(API_URL + `notification/delete/${id}`)
    }

}

export default new NotificationService