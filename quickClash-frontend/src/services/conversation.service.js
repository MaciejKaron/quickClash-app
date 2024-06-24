import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class ConversationService {
    createConversation(data) {
        return axios.post(API_URL + 'conversation', data)
    }

    getConversation(id) {
        return axios.get(API_URL + `conversation/${id}`)
    }

    getCommonConversation(id1, id2) {
        return axios.get(API_URL + `conversation/${id1}/${id2}`)
    }
}

export default new ConversationService