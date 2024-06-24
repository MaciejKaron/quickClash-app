import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class TeamService {
    createTeam(data) {
        return axios.post(API_URL + 'team', data)
    }

    findOneTeam(id) {
        return axios.get(API_URL + `team/${id}`)
    }

    findAllTeams(searchName) {
        return axios.get(API_URL + `team/find/all?name=${searchName}`)
    }

    getAllTeams() {
        return axios.get(API_URL + `team/get/all`)
    }

    deleteTeam(id) {
        return axios.delete(API_URL + `team/${id}`)
    }

    updateTeam(id, data) {
        return axios.put(API_URL + `team/update/${id}`, data)
    }

    deleteAllTeams() {
        return axios.delete(API_URL + 'team/delete/all')
    }

    addToPending(id, data) {
        return axios.post(API_URL + `team/add/${id}`, data)
    }

    removeFromPending(id, data) {
        return axios.post(API_URL + `team/cancel/${id}`, data)
    }

    confirmTeamInvitation(id, data) {
        return axios.post(API_URL + `team/accept/${id}`, data)
    }

    declineTeamInvitation(id, data) {
        return axios.post(API_URL + `team/decline/${id}`, data)
    }

    removeFromTeam(id, data) {
        return axios.post(API_URL + `team/remove/${id}`, data)
    }

    leaveTeam(id, data) {
        return axios.post(API_URL + `team/leave/${id}`, data)
    }
}

export default new TeamService()