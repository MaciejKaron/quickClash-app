import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class MessageService {

    createMessage(data) {
        return axios.post(API_URL + 'message', data)
    }

    getMessage(id) {
        return axios.get(API_URL + `message/${id}`)
    }
}

export default new MessageService