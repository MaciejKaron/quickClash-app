import axios from 'axios'
import authHeader from './auth-header'
const API_URL = 'http://localhost:8080/api/test/'
const API_URL2 = 'http://localhost:8080/api/'

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all')
    }
    
    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }
    
    getModeratorBoard() {
        return axios.get(API_URL + 'mod', { headers: authHeader() });
    }
    
    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }

    findOneUser(id) {
        return axios.get(API_URL2 + `user/${id}`)
    }

    updateUser(id, data) {
        return axios.put(API_URL2 + `user/${id}`, data)
    }

    findAllUsers(searchName) {
        return axios.get(API_URL2 + `user/find/all?username=${searchName}`)
    }

    getAllUsers() {
        return axios.get(API_URL2 + `user/get/all`)
    }

    addToPending(id, data) {
        return axios.post(API_URL2 + `user/friend/${id}`, data)
    }

    removeFromFriends(id, data) {
        return axios.post(API_URL2 + `user/unfriend/${id}`, data)
    }

    confirmTheInvitation(id, data) {
        return axios.post(API_URL2 + `user/accept/${id}`, data)
    }

    removeFromPending(id, data) {
        return axios.post(API_URL2 + `user/remove/${id}`, data)
    }

    declineTheInvitation(id, data) {
        return axios.post(API_URL2 + `user/decline/${id}`, data)
    }

    findOneUserAndFriends(id) {
        return axios.get(API_URL2 + `user/find/friends/${id}`)
    }

    findOneUserByUsername(id) {
        return axios.get(API_URL2 + `user/username/${id}`)
    }
    
}

export default new UserService()