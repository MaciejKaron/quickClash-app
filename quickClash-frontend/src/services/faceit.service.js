import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class FaceitService {

    getMyFaceitStats(id) {
        return axios.get(API_URL + `faceit/stats/${id}`)
    }

    getGameStats(id) {
        return axios.get(API_URL + `faceit/game/stats/${id}`)
    }

    getMyAllFaceitStats(id) {
        return axios.post(API_URL + `faceit/all/stats/${id}`)
    }

    findOneStats(id) {
        return axios.get(API_URL + `faceit/stats/find/${id}`)
    }

    getVerifiedUsers() {
        return axios.get(API_URL + 'faceit/verified')
    }

    getRankingStats() {
        return axios.get(API_URL + 'faceit/ranking')
    }

    getPlayerHistory(id) {
        return axios.get(API_URL + `faceit/history/${id}`)
    }
}

export default new FaceitService