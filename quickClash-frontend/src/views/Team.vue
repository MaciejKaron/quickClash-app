<template>
    <div class="wrapper">
        <div class="add-form">
            <div class="add_txt">
                <h2 v-if="thisCurrentUser.isInTeam == false">Create your team!</h2>
            </div>
            <div class="submit-form">
                <div v-if="thisCurrentUser.isInTeam == false">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" required v-model="team.name" name="name" />
                </div>
                <div class="form-group">
                    <label for="tag">Tag</label>
                    <input type="text" class="form-control" id="tag" required v-model="team.tag" name="tag" />
                </div>
                <button @click="saveTeam()" class="team-create-button customButton">Submit</button>
                </div>
            </div>
        </div>
            <div class="your-team">
                <div class="after_txt" v-if="thisCurrentUser.isInTeam == true">
                <h2>{{currentTeam.name}} / {{currentTeam.tag}}</h2>
                <h3 v-if="currentTeam.level != 0">
                    <font-awesome-icon class="faa-pulse animated faa-slow" id="icon-star" icon="star" />
                    Team Ratio: {{currentTeam.level}}
                    <font-awesome-icon class="faa-pulse animated faa-slow" id="icon-star" icon="star" />
                </h3>
                    
                <p><strong>OWNER:</strong></p>
                <div class="member-box">
                        <div class="member-avatar">
                            <img class="avatar" v-if="owner.faceitAvatar != '' " :src="owner.faceitAvatar" />
                            <img class="avatar" v-if="owner.faceitAvatar == '' " :src="require('@/assets/unknown.jpg')" />
                        </div>
                        <div class="member-username"> 
                            {{owner.username}}
                        </div>
                        <div class="member-verified">
                            {{owner.faceitVerified ? "Verified" : "Not verified"}}
                        </div>
                        </div>
                <p><strong>MEMBERS:</strong></p>
                <div class="members-list">
                <div class="row">
                    <!-- LIST OF TEAM MEMBERS -->
                    <div class="col-sm" 
                    :class="{ active: index == currentIndex}"
                    v-for="(friend,index) in players"
                    :key="index"
                    @click="setActiveUser(friend, index)">
                        <div class="member-box">
                        <div class="member-avatar">
                            <img class="avatar" v-if="friend.faceitAvatar != '' " :src="friend.faceitAvatar" />
                            <img class="avatar" v-if="friend.faceitAvatar == '' || friend.faceitAvatar == undefined " :src="require('@/assets/unknown.jpg')" />
                        </div>
                        <div class="member-username"> 
                            {{friend.username}}
                        </div>
                        <div class="member-verified">
                            {{friend.faceitVerified ? "Verified" : "Not verified"}}
                        </div>
                        </div>
                    </div>
                </div>
                    <!-- LIST OF BUTTON FOR TEAM MEMEBER -->
                    <div class="row" v-if="thisPlayer && thisCurrentUser._id == currentTeam.owner">
                    <div class="col-sm" 
                    v-for="(friend,index) in players"
                    :key="index">
                    <button class="customButton" v-show="thisPlayer.username == friend.username && thisPlayer.username !== owner.username" @click="removeFromTeam(); sendInfoSocketRemove()">Remove</button>
                    </div>
                    </div>
                </div>
                <div class="leave-box" v-if="thisCurrentUser._id !== currentTeam.owner">
                <h4>Team Settings</h4>
                <button class="leave-team-button customButton"  @click="leaveTeam(); sendInfoSocketLeave()">Leave Team</button>
                </div>
                </div>
            </div>
                <div class="team-settings" v-if="thisCurrentUser.isInTeam == true && thisCurrentUser._id == currentTeam.owner">
                <h4>Team Settings</h4>
                <!-- <button class="btn btn-success" @click="goToYourTeam()">Team settings</button> -->
                <div>
                    <button class="customButton" @click="teamReady()">Team ready!</button>
                </div>
                <button class="team-delete-button customButton" @click="showPopup()">Delete your team</button>
                <Popup
                    v-show="isPopupVisible"
                    @close="closePopup()"
                    >
                    <template v-slot:header>
                    <!-- This is a new modal header. -->
                    </template>

                    <template v-slot:body>
                    <div class="popup-txt">Do you really want to delete your team?</div>
                    <button class="customButton edit-delete-v2" @click="deleteTeam(); sendInfoSocketDelete()">DELETE!</button>
                    </template>

                    <template v-slot:footer>
                    <!-- This is a new modal footer. -->
                    </template>
                </Popup>
            </div>

    </div>
</template>

<script>
import teamService from "@/services/team.service"
import userService from "@/services/user.service"
import socketioService from '@/services/socketio.service'
import Popup from "@/components/Popup.vue"
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
export default {
    name: "Team-comp",
    components: {
    Popup,
},
    data() {
        return {
            team: {
                id: null,
                name: "",
                tag: "",
                owner: null,
                players: [],
            },
            submitted: false,
            thisCurrentUser: [],
            currentTeam: [],
            owner: [],
            players: [],
            newPlayer: null,
            leaver: null,
            thisUser: null,
            currentIndex: -1,
            thisPlayer: null,
            isPopupVisible: false,
            teamLevel: 0,
            toast: useToast(),
        }
    },
    methods: {
        saveTeam() {
            var data = {
                name: this.team.name,
                tag: this.team.tag,
                owner: this.team.owner,
                players: this.team.players
            }
            teamService.createTeam(data)
                .then(response => {
                    this.team.id = response.data._id
                    // console.log(response.data._id)
                    // this.$router.push({ name: 'myTeam', params: { id: response.data._id } })
                    this.getOneUser(this.thisCurrentUser._id)
                    this.submitted = true
                
                })
                .catch(e => {
                console.log(e)
                })
        },
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                    this.team.owner = this.thisCurrentUser._id
                // console.log(response.data)

                //GET CURRENT USER TEAM
                    if (this.thisCurrentUser.isInTeam == true) {
                        this.getOneTeam(this.thisCurrentUser.team)
                    }
                })
                .catch(e => {
                console.log(e)
            })
        },
        getOneTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.currentTeam = response.data
                // console.log(response.data)

                //GET OWNER INFORMATIONS
                    this.findOwnerUsername()

                //GET INFORMATIONS ABOUT PLAYERS
                this.findPlayersUsernames()
                })
                .catch(e => {
                console.log(e)
            })
        },
        findOwnerUsername() {
            userService.findOneUser(this.currentTeam.owner)
                .then(response => {
                    this.owner = response.data
                    // console.log(this.owner)
            })
        },
        findPlayersLoop() {
            for (var i = 0; i < this.currentTeam.players.length; i++){
                userService.findOneUser(this.currentTeam.players[i])
                    .then(response => {
                        this.players.push(response.data)
                })
            }

            //FIND TEAM LEVEL
            if (this.currentTeam.players.length == 5) {
                for (let i = 0; i < this.currentTeam.players.length; i++) {
                    userService.findOneUser(this.currentTeam.players[i])
                        .then(response => {
                            this.teamLevel += parseInt(response.data.faceitLevel)
                        })
                }
            }
        },

        clearPlayersLoop() {
            for (var i = 0; i < this.currentTeam.players.length; i++) {
                        userService.findOneUser(this.currentTeam.players[i])
                            .then(response => {
                                this.players.pop(response.data)
                            })
                    }
        },

        findPlayersUsernames() {
            //IF NEW PLAYEER
            this.$watch("newPlayer", () => {
                console.log('123');
                if (this.newPlayer !== undefined) {
                    this.currentTeam.players.push(this.newPlayer)

                    this.clearPlayersLoop()
                    this.findPlayersLoop()
                }
                this.teamLevel = 0
            })
            //IF PLAYER LEAVE
            this.$watch("leaver", () => {
                console.log('456');
                if (this.leaver !== undefined) {
                    this.clearPlayersLoop()
                    if (this.currentTeam.players.includes(this.leaver)) {
                        this.currentTeam.players = this.currentTeam.players.filter(f => !f.includes(this.leaver))
                    }
                    this.$nextTick(function () {
                        this.findPlayersLoop()
                    })
                }
                this.teamLevel = 0
                var data = {
                    level: 0
                }
                teamService.updateTeam(this.currentTeam._id, data)
                    .then(response => {
                        console.log(response.data.message);
                    })
            })
            //STANDARD EXECUTE
            this.findPlayersLoop()
        },

        deleteTeam() {
            teamService.deleteTeam(this.thisCurrentUser.team)
                .then(response => {
                    console.log(response.data)
                 this.submitted = false
                    this.team = {}
                })
                .catch(e => {
                console.log(e)
                })
            // this.reloadPage()
        },

        leaveTeam() {
            var data = {
                _id: this.currentTeam._id
            }
            teamService.leaveTeam(this.thisCurrentUser._id, data)
                .then(response => {
                    console.log(response);
                this.reloadPage()
            })    
        },

        sendInfoSocketLeave() {
            for (var i = 0; i < this.currentTeam.players.length; i++) {
                const receiverId = this.currentTeam.players[i]
                socketioService.socket.emit("sendInfo", {
                    receiverId,
                    teamInviteSend: false,
                    isInTeam: false,
                    leaver: this.thisCurrentUser._id
                })
            }
        },
        sendInfoSocketRemove() {
            for (var i = 0; i < this.currentTeam.players.length; i++) {
                const receiverId = this.currentTeam.players[i]
                socketioService.socket.emit("sendInfo", {
                   receiverId,
                    teamInviteSend: false,
                    isInTeam: false,
                    leaver: this.thisPlayer._id
                })
            }
        },

        sendInfoSocketDelete() {
            for (var i = 0; i < this.currentTeam.players.length; i++) {
                const receiverId = this.currentTeam.players[i]
                socketioService.socket.emit("sendInfo", {
                   receiverId,
                    teamInviteSend: false,
                    isInTeam: false,
                    deleted: true
                })
            }
        },

        getInfoSocketConfirmOrDeclineorLeaveOrRemove() {
            socketioService.socket.on("getInfo", (data) => {
                if (data.newPlayer !== undefined) {
                    if (data.newPlayer == this.newPlayer) {
                        this.$nextTick(function () {
                            this.newPlayer = undefined
                    this.$nextTick(function () {
                    this.newPlayer = data.newPlayer
                })
                })
                    }
                    this.newPlayer = data.newPlayer
                    // console.log(this.newPlayer);
                }
                if (data.leaver !== undefined) { 
                    if (data.leaver == this.leaver) {
                        this.$nextTick(function () {
                            this.leaver = undefined
                    this.$nextTick(function () {
                    this.leaver = data.leaver
                })
                })
                    }
                    this.leaver = data.leaver
                // console.log(this.leaver);
                }
                //IF REMOVED USER
                if (data.leaver == this.thisCurrentUser._id) {
                this.reloadPage()
                }
                //IF TEAM DELETED
                if (data.deleted == true) {
                this.reloadPage()
                }
            })
        },

        findOneUserByUsername(username) {
            userService.findOneUserByUsername(username)
                .then(response => {
                this.thisPlayer = response.data;
                // console.log(this.thisFriendUser._id);
            });
        },

        setActiveUser(friend, index) {
            this.thisUser = friend;
            this.currentIndex = index;
            this.findOneUserByUsername(this.thisUser.username)
            console.log(this.thisUser);
        },
        removeFromTeam() {
            var data = {
                _id: this.currentTeam._id
            }
            teamService.removeFromTeam(this.thisPlayer._id, data)
                .then(response => {
                    console.log(response);
                this.reloadPage()
                })
            .catch(e => {
                console.log(e);
            })
        }, 

        teamReady() {
            if (this.currentTeam.players.length == 5) {

                var data = {
                    level: this.teamLevel / this.currentTeam.players.length,
                    ownerAvatar: this.owner.faceitAvatar
                }
                teamService.updateTeam(this.currentTeam._id, data)
                    .then(response => {
                        console.log(response.data.message);
                    })
                    this.toast.open({
                        message: 'Team is ready!',
                        type: 'success',
                        position: 'top-left',
                        duration: 5000,
                    })
                    this.reloadPage()
            } else {
                this.toast.open({
                        message: 'You must have a full team',
                        type: 'error',
                        position: 'top-left',
                        duration: 5000,
                    })
            }
        },

        goToYourTeam() {
            this.$router.push({name:'myTeam', params: {id: this.thisCurrentUser.team[0]}});
        },
        reloadPage() {
      window.location.reload();
        },
    log(message) {
            console.log(message);
        },
        showPopup() {
          this.isPopupVisible = true
      },
      closePopup() {
          this.isPopupVisible = false
        }
    },
    mounted() {
        this.getOneUser(this.currentUser._id) 
        this.getInfoSocketConfirmOrDeclineorLeaveOrRemove()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        },
    },
}
</script>

<style scoped>
.welcome{
  max-width: 400px;
  margin:auto
}

.add-form{
    max-width: 20em;
    margin-top: 4em;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
     text-align: center;
     font-family: roboto;
     font-size: 24px;
}

.your-team{
    max-width: 60em;
    margin-top: auto;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
     text-align: center;
     font-family: roboto;
     color: white;
}

.add_txt{
  text-align: center;
  margin-bottom: 3em;
  color: white;
}

.team-settings{
    text-align: center;
    margin-top: 3em;
    color: white;
}

.btn.btn-success{
  text-align: center;
  margin-top: 1em;
}
.btn.btn-warning{
  text-align: center;
  margin-top: 1em;
}

#main{
    max-width: 25em;
}


.form-group{
    color: white;
}

.form-control{
    background-color: #1a1a1d;
    border: 1px solid #6f2232;
    color: white;
    text-align: center;
}

.customButton {
    text-align: center;
    margin-top: 1em;
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.customButton:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.member-box{
    background-color: #1a1a1d;
    width: 10em;
    height: 10em;
    margin-top: 1em;
    margin-right: auto;
    margin-bottom: 0.5em;
    margin-left: auto;
     text-align: center;
     font-family: roboto;
     border-radius: 5%;
     border: 1px solid #6f2232;
}

.avatar{ 
    margin-top: 1em;
  max-width: 4em;
  max-height: 4em;
  border-radius: 66px;
}

.member-username{
    margin-top: 0.5em;
}

.memeber-verified{
    margin-top: 1em;
}

.leave-box{
    margin-top: 1em;
}

/* .active{
    border: 1px solid #6f2232;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:0px 0px 36px 2px #c3073f;
} */

.popup-txt{
  color: white;
  font-family: roboto;
  font-size: 24px;
}

.edit-delete-v2{
  margin-top: 2em;
}

.team-delete-button{
    margin-top: 1em;
    margin-bottom: 1em;
}

#icon-star{
    color: #FFD700;
}

</style>