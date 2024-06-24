import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class PaymentService {
    payment() {
        return axios.post(API_URL + `payment`)
    }
}

export default new PaymentService