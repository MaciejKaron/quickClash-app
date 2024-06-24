import axios from 'axios'
// import authHeader from './auth-header'
const API_URL = 'http://localhost:8080/api/'

class TournamentService {
    createTournament(data) {
        return axios.post(API_URL + 'tournaments', data)
    }

    findAllTournaments(currentPage, searchTitle, pageSize) {
        return axios.get(API_URL + `tournaments/all?page=${currentPage}&title=${searchTitle}&size=${pageSize}`)
    }

    findAllPublishedTournaments(currentPage,searchTitle,pageSize) {
        return axios.get(API_URL + `tournaments/published?page=${currentPage}&title=${searchTitle}&size=${pageSize}`)
    }

    findOneTournament(id) {
        return axios.get(API_URL + `tournaments/${id}`)
    }

    updateTournament(id,data) {
        return axios.put(API_URL + `tournaments/${id}`, data)
    }

    deleteTournament(id) {
        return axios.delete(API_URL + `tournaments/${id}`)
    }

    deleteAllTournaments() {
        return axios.delete(API_URL + 'tournaments/delete/all')
    }

    findTournamentByTitle(title) {
        return axios.get(API_URL + `tournaments/published?title=${title}`)
    }

    addUserToTournament(id,data) {
        return axios.post(API_URL + `tournaments/join/${id}`, data)
    }

    leaveUserFromTournament(id, data) {
        return axios.post(API_URL + `tournaments/rejoin/${id}`, data)
    }

    addTeamToTournament(id, data) {
        return axios.post(API_URL + `tournaments/joinTeam/${id}`, data)
    }

    leaveTeamFromTournament(id, data) {
        return axios.post(API_URL + `tournaments/rejoinTeam/${id}`, data)
    }

    goToStage2(id, data) {
        return axios.post(API_URL + `tournaments/stage2/${id}`, data)
    }

    goToStage3(id, data) {
        return axios.post(API_URL + `tournaments/stage3/${id}`, data)
    }

    goToStage4(id, data) {
        return axios.post(API_URL + `tournaments/stage4/${id}`, data)
    }

    goToStage5(id, data) {
        return axios.post(API_URL + `tournaments/stage5/${id}`, data)
    }

    backToStage1(id, data) {
        return axios.post(API_URL + `tournaments/remove/stage2/${id}`, data)
    }

    backToStage2(id, data) {
        return axios.post(API_URL + `tournaments/remove/stage3/${id}`, data)
    }

    backToStage3(id, data) {
        return axios.post(API_URL + `tournaments/remove/stage4/${id}`, data)
    }

    backToStage4(id, data) {
        return axios.post(API_URL + `tournaments/remove/stage5/${id}`, data)
    }
}

export default new TournamentService()