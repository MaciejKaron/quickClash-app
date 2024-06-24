<template>
    <div class="list row">
    <div class="col-md-8">
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Search by name" v-model="searchName" />
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="filteredName">Search</button>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <h4>Users List</h4>
        <ul class="list-group" id="Friends-comp">
            <li class="list-group-item"
        :class="{ active: index == currentIndex}"
        v-for="(user,index) in users"
        :key="index"
        @click="setActiveUser(user,index)"
        >
        {{ user.username}}
        </li>
        </ul>
    </div>
    <div class="col-md-6">
        <div v-if="thisUser">
        <h4>User</h4>
        <div>
            <label><strong>Username:</strong></label> {{thisUser.username}}
        </div>
        <div>
            <label><strong>Email:</strong></label> {{thisUser.email}}
        </div>
        <div>
            <label><strong>Vip:</strong></label> {{thisUser.vip}}
        </div>
        <div>
            <label><strong>Friends:</strong></label> {{thisUser.friends}}
        </div>
        <button class="profile-button" @click="goToProfile()">Profile</button>
        </div>
        <div>
            <br />
            <p>Please click on User...</p>
        </div>
    </div>
</div>
</template>

<script>
import userService from "@/services/user.service";
export default {
    name: "Friends-comp",
    data() {
        return {
            users: [],
            thisUser: null,
             thisThisUser: [],
            currentIndex: -1,
            searchName: "",
        }
    },
    methods: {
        getAllUsers() {
            userService.findAllUsers(this.searchName)
                .then((response) => {
                    this.users = response.data
                    console.log(response.data)
                })
                .catch(e => {
            console.log(e)
        })
        },
        filteredName() {
            this.getAllUsers()
        },
        setActiveUser(user, index) {
            this.thisUser = user
            this.currentIndex = index
            console.log(this.thisUser)
        },
        goToProfile() {
            this.$router.push({name:'UserProfile', params: {id: this.thisUser._id}});
        },
         log(message) {
            console.log(message)
        }
    },
    mounted() {
        this.getAllUsers()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>

<style scoped>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}

.list-group {
    height:150px;
  overflow-y: scroll;
}
</style>