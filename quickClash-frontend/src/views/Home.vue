<template>
    <div class="tournament-searcher">
        <div class="input-tournament inline">
        <input type="text" class="form-control input-tournament-name" placeholder="Search by title" v-model="searchTitle" />
        </div>
        <div class="input-button inline">
        <button class="btn btn-outline-dark" type="button" @click="filteredTitle">Search</button>
    </div>
       
    </div>
<div class="main">
    <div class="pagination-wrapper inline">
        <button class="pagination-button" @click="previousPage();"><font-awesome-icon icon="arrow-left" /></button>
    </div>
    <transition name="tournament-list-transition">
        <div class="tournament-list-box" v-if="changePage == false">
    <div class="tournaments-list" 
        :class="{ active: index == currentIndex && isActive}"
        v-for="(tournament,index) in tournaments"
        :key="index"
        @click="setActiveTournament(tournament,index)">
        <div class="tournament-box">
            <div class="row row-picture">
                <div class="col">
                    <img class="tournament-image" v-if="tournament.image"  :src="tournament.image" />
                    <img class="tournament-image" v-if="tournament.image == '' " :src="require('@/assets/tournament-banner.jpg')" />
                </div>
            </div>
            <div class="row row-title">
                <div class="col">
                    {{tournament.title}}
                </div>
            </div>
            <div class="row row-startTime">
                <div class="col">
                    Start Time (UTC + 2)
                    <br>
                    {{displayDate(tournament.startTime)}}
                </div>
            </div>
            <div class="row row-details-titles">
                <div class="col col-md-3">
                    <p> Slots <font-awesome-icon icon="people-group" /> </p>
                </div>
                <div class="col col-sm-3">
                    <p> Mode </p>
                </div>
                <div class="col col-sm-3">
                    <p> Level </p>
                </div>
                <div class="col col-sm-3">
                    <p> Status </p>
                </div>
            </div>
            <div class="row row-details">
                <div class="col col-md-3">
                <div class="tournament-players" v-if="tournament.mode == '1v1'">
                    {{tournament.players.length}} / {{tournament.slots}}
                </div>
                <div class="tournament-teams" v-if="tournament.mode == '5v5'">
                    {{tournament.teams.length}} / {{tournament.slots}}
                </div>
                </div>
                <div class="col col-sm-3">
                    {{tournament.mode}}
                </div>
                <div class="col col-sm-3">
                    {{tournament.level}}
                </div>
                <div class="col col-sm-3">
                    {{tournament.premium ? "Premium" : "Free"}}
                </div>
            </div>
            <div class="row row-buttons" v-if="currentTournament">
                <div class="col">
                    <div class="1v1" v-if="currentTournament.mode == '1v1' && currentTournament._id == tournament._id">
                    <button class="join-button" v-if="!currentTournament.players.includes(thisCurrentUser._id)" @click="joinUserToTournament()"><span>JOIN SOLO</span></button>
                    <button class="leave-button" v-if="currentTournament.players.includes(thisCurrentUser._id)" @click="rejoinUserFromTournament()">LEAVE</button>
                    <button class="leave-button" @click="goToInfo()">LADDER</button>
                    <button class="leave-button" @click="showPopup()" v-if="showAdminBoard || showModeratorBoard">ADD PLAYERS</button>
                </div>
                <div class="5v5" v-if="currentTournament.mode == '5v5' && currentTournament._id == tournament._id">
                    <button class="join-button" v-if="!currentTournament.teams.includes(thisCurrentUser.team.toString())" @click="joinTeamToTournament()">JOIN WITH TEAM</button>
                    <button class="leave-button" v-if="currentTournament.teams.includes(thisCurrentUser.team.toString())" @click="rejoinTeamFromTournament()">LEAVE</button>
                    <button class="leave-button" @click="goToInfo5v5()">LADDER</button>
                    <button class="leave-button" @click="showPopup()" v-if="showAdminBoard || showModeratorBoard">ADD TEAMS</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </transition>
        <div class="pagination-wrapper inline">
            <button class="pagination-button" @click="nextPage();"><font-awesome-icon icon="arrow-right" /></button>
        </div>
    
</div>
<div class="tournament-list-page">
        Page: {{currentPage + 1}} / {{totalPages}}
    </div> 
<!-- popup -->
                <TournamentPopup
                    v-if="isPopupVisible"
                    @close="closePopup(); refreshList()"
                    >
                    <template v-slot:header>
                       
                    </template>

                    <template v-slot:body>
                        <p class="labelInfo" v-if="currentTournament.mode == '1v1'">Search users</p>
                        <div class="searchBar" v-if="currentTournament.mode == '1v1'">
                            <div class="searchBar-searcher">
                            <input class="searcher" type="text" id="search" placeholder="Search ..." v-model="searchName" />
                            </div>
                            <transition name="searcher-transition">
                            <div class="searchBar-list">
                            <div class="search-list" v-if="searchName !== ''">
                            <div v-if="searchName !== '' && searchUsers.length == 0 ">Nothink found</div>
                            <div v-if="searchName !== '' && searchUsers.length > 0">Users:</div>
                            <ul class="tournament-player-list">
                            <li class="users-list"
                                :class="{ playerActive: index == currentIndex}"
                                v-for="(user, index) in searchUsers" :key="index"
                                @click="setActivePlayer(user,index)">
                                    <img class="avatar" v-if="user.faceitAvatar != '' " :src="user.faceitAvatar" />
                                    <img class="avatar" v-if="user.faceitAvatar == '' " :src="require('@/assets/unknown.jpg')" />
                                    {{user.username}}
                                    <div class="player-options" v-if="thisUser">
                                    <button class="leave-button add-player-button" @click="addPlayerToTournament()" v-if="thisUser._id == user._id">ADD</button>
                                    <button class="leave-button kick-player-button" @click="kickPlayerFromTournament()" v-if="thisUser._id == user._id">KICK</button>
                                    </div>
                            </li>
                            </ul>
                            </div>
                            </div>
                            </transition>
                        </div>

                        <p class="labelInfo" v-if="currentTournament.mode == '5v5'">Search teams</p>
                        <div class="searchBar" v-if="currentTournament.mode == '5v5'">
                            <div class="searchBar-searcher">
                            <input class="searcher" type="text" id="search" placeholder="Search ..." v-model="searchName" />
                            </div>
                            <transition name="searcher-transition">
                            <div class="searchBar-list">
                            <div class="search-list" v-if="searchName !== ''">
                            <div v-if="searchName !== '' && searchTeams.length == 0 ">Nothink found</div>
                            <div v-if="searchName !== '' && searchTeams.length > 0">Teams:</div>
                            <ul class="tournament-player-list">
                            <li class="users-list"
                                :class="{ teamActive: index == currentIndex}"
                                v-for="(team, index) in searchTeams" :key="index"
                                @click="setActiveTeam(team,index)">
                                <div class="teamAvatar" style="display: inline-block">
                                    <img class="avatar" v-if="team.ownerAvatar != '' " :src="team.ownerAvatar" />
                                    <img class="avatar" v-if="team.ownerAvatar == '' " :src="require('@/assets/unknown.jpg')" />
                                </div>
                                <div class="teamTag" style="color: red; display: inline-block;">
                                    {{team.tag}}
                                </div>
                                <div class="teamName" style="display: inline-block;">
                                    {{team.name}}
                                </div>
                                    <div class="player-options" v-if="thisTeam">
                                    <button class="leave-button add-player-button" @click="addTeamToTournament()" v-if="thisTeam._id == team._id">ADD</button>
                                    <button class="leave-button kick-player-button" @click="kickTeamFromTournament()" v-if="thisTeam._id == team._id">KICK</button>
                                    </div>
                            </li>
                            </ul>
                            </div>
                            </div>
                            </transition>
                        </div>
                    </template>

                    <template v-slot:footer>
                    <!-- This is a new modal footer. -->
                    </template>
                </TournamentPopup>
</template>

<script>
import tournamentService from "@/services/tournament.service";
import userService from "@/services/user.service";
import moment from "moment"
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import TournamentPopup from "@/components/TournamentPopup.vue"
import faceitService from "@/services/faceit.service";
import teamService from "@/services/team.service"
// import image from "../assets/background.jpg"

export default {
    name: "Home-comp",
    components: {
        TournamentPopup
},
    data() {
        return {
            tournaments: [],
            currentTournament: null,
            currentIndex: -1,
            pageSize: 3,
            pageSizes: [3, 6, 9, 12, 15, 18],
            tournamentsPaginated: [],
            searchTitle: "",
            currentPage: 0,
            totalPages: null,
            totalItems: null,
            thisCurrentUser: null,  
            isActive: false,
            toast: useToast(),
            isPopupVisible: false,
            tournamentTitle: "",
            tournamentPlayers: [],
            thisUser: null,
            thisTeam: null,
            currentUserIndex: -1,
            currentTeamIndex: -1,
            thisStats: [],
            changePage: false,
            searchName: "",
            allUsers: [],
            allTeams: [],
            pageSizeV2: 1,
            size: 3,
        }
    },
    methods: {
        getAllPublishedTournaments() {
            if (window.innerWidth < 1400) {
                this.size = 1
            }
            if (window.innerWidth > 1400) {
                this.size = 3
            }
                tournamentService.findAllPublishedTournaments(this.currentPage, this.searchTitle, this.size)
                    .then((response) => {
                        this.tournamentsPaginated = response.data
                        // console.log(response.data)
                        this.totalPages = this.tournamentsPaginated.totalPages
                        this.tournaments = this.tournamentsPaginated.tournaments
                        this.totalItems = this.tournamentsPaginated.totalItems
                    })
                    .catch(e => {
                        console.log(e)
                    })
        },
        nextPage() {
            if (!(this.currentPage === this.totalPages - 1)) {
                this.currentPage++
                this.getAllPublishedTournaments()
                this.changePage = true
                this.$nextTick(function () {
                    this.changePage = false
                })
            }
            this.currentIndex = -1
        },
         previousPage() {
            if (!(this.currentPage === 0)) {
                this.currentPage--
                this.getAllPublishedTournaments()
                this.changePage = true
                this.$nextTick(function () {
                    this.changePage = false
                })
             }
             this.currentIndex = -1
        },
        filteredTitle() {
            this.currentPage = 0
            this.getAllPublishedTournaments()
        },
        handlePageSizeChange(event) {
            this.pageSize = event.target.value
            this.page = 0
            this.getAllPublishedTournaments()
        },

        refreshList() {
            this.getAllPublishedTournaments()
            this.currentTournament = null
            this.currentIndex = -1
        },
        setActiveTournament(tournament, index) {
            this.currentTournament = tournament
            this.currentIndex = index
            this.isActive = true
            this.tournamentPlayers = []
            this.tournamentTitle = this.currentTournament.title

            for (let i = 0; i < tournament.players.length; i++){
                userService.findOneUser(tournament.players[i])
                    .then(response => {
                        faceitService.getMyFaceitStats(tournament.players[i])
                            .then(responsev2 => {
                                const { skill_level, faceit_elo } = responsev2.data.games.csgo
                                const { _id, username, faceitAvatar} = response.data
                                this.tournamentPlayers.push({_id, username, faceitAvatar, skill_level, faceit_elo})
                                // console.log(this.tournamentPlayers);      
                        })
                })
            }
        },
        removeAllTournaments() {
            tournamentService.deleteAllTournaments()
                .then((response) => {
                    console.log(response.data)
                this.refreshList()
                })
                .catch(e => {
                console.log(e)
            })
        },
        joinUserToTournament() {
            tournamentService.addUserToTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                    console.log(response.data)
                    this.refreshList()
                    this.toast.open({
                        message: response.data.msg,
                        type: 'success',
                        position: 'top-left',
                        duration: 5000,
                    })
                })
                .catch(e => {
                    console.log(e)
                    this.toast.open({
                        message: e.response.data.msg,
                        type: 'error',
                        position: 'top-left',
                        duration: 5000,
                    })
            })
        },

        rejoinUserFromTournament() {
            tournamentService.leaveUserFromTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                    console.log(response.data)
                    this.refreshList()
                    this.toast.open({
                        message: response.data.msg,
                        type: 'success',
                        position: 'top-left',
                        duration: 5000,
                    })
                })  
                .catch(e => {
                    console.log(e)
                    this.toast.open({
                        message: e.response.data.msg,
                        type: 'error',
                        position: 'top-left',
                        duration: 5000,
                    })
          })
        },

        joinTeamToTournament() {
            var data = {
                _id: this.thisCurrentUser._id.toString()
            }
            tournamentService.addTeamToTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data);
                    this.refreshList()
                    this.toast.open({
                        message: response.data.msg,
                        type: 'success',
                        position: 'top-left',
                        duration: 5000,
                    })
                })  
          .catch(e => {
              console.log(e)
              this.toast.open({
                        message: e.response.data.msg,
                        type: 'error',
                        position: 'top-left',
                        duration: 5000,
                    })
          })
        },

        rejoinTeamFromTournament() {
            var data = {
                _id: this.thisCurrentUser.team.toString()
            }
            tournamentService.leaveTeamFromTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data);
                    this.refreshList()
                    this.toast.open({
                        message: response.data.msg,
                        type: 'success',
                        position: 'top-left',
                        duration: 5000,
                    })
                })  
          .catch(e => {
              console.log(e)
              this.toast.open({
                        message: e.response.data.msg,
                        type: 'error',
                        position: 'top-left',
                        duration: 5000,
                    })
          })
        },

        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                // console.log(this.thisCurrentUser);
                })
                .catch(e => {
                console.log(e)
            })
        },
        displayDate(value) {
            if (value) {
                 return moment(String(value)).format('MM/DD/YYYY hh:mm a')
            }
            // if (this.currentUser.faceitCountry == 'ar') {
            //     if (value) {
            //         return moment(String(value)).utcOffset('-0300').format('MM/DD/YYYY hh:mm a')
            //     }
            // }
            // if (this.currentUser.faceitCountry == 'pl') {
            //     if (value) {
            //         return moment(String(value)).utcOffset('+0200').format('MM/DD/YYYY hh:mm a')
            //     }
            // }
            // if (this.currentUser.faceitCountry == 'ru') {
            //     if (value) {
            //         return moment(String(value)).utcOffset('+0300').format('MM/DD/YYYY hh:mm a')
            //     }
            // } else {
            //     if (value) {
            //         return moment(String(value)).utc().format('MM/DD/YYYY hh:mm a')
            //     } 
            // }
        },
        log(message) {
            console.log(message)
        },
        reloadPage() {
      window.location.reload();
        },
        showPopup() {
          this.isPopupVisible = true
      },
      closePopup() {
          this.isPopupVisible = false
        },
        setActivePlayer(user, index) {
            this.thisUser = user
            this.currentUserIndex = index
            console.log(this.thisUser);
            // this.goToProfile()
        },
        setActiveTeam(team, index) {
            this.thisTeam = team
            this.currentTeamIndex = index
            console.log(this.thisTeam);
        },
        goToProfile() {
          this.$router.push({name:'UserProfile', params: {id: this.thisUser._id}});
        },
        goToInfo() {
          this.$router.push({name:'tournamentInfo', params: {id: this.currentTournament._id}});
        },
        goToInfo5v5() {
          this.$router.push({name:'tournamentInfo5v5', params: {id: this.currentTournament._id}});
        },

        getAllUsers() {
      userService.getAllUsers()
        .then(response => {
          this.allUsers = response.data
        })
      .catch(e => {
            console.log(e)
        })
        },
        getAllTeams() {
      teamService.getAllTeams()
        .then(response => {
        this.allTeams = response.data
        })
      .catch(e => {
            console.log(e)
        })
        },

        addPlayerToTournament() {
            var data = {
                _id: this.thisUser._id
            }
            tournamentService.addUserToTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data)
                })
                .catch(e => {
                    console.log(e)
            })
        },

        kickPlayerFromTournament() {
            var data = {
                _id: this.thisUser._id
            }
            tournamentService.leaveUserFromTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data)
                })  
                .catch(e => {
                    console.log(e)
          })
        },

        addTeamToTournament() {
            var data = {
                _id: this.thisTeam.owner.toString()
            }
            tournamentService.addTeamToTournament(this.currentTournament._id, data)
                .then(response => {
                console.log(response.data);
                })
                .catch(e => {
                    console.log(e)
            })
        },

        kickTeamFromTournament() {
            var data = {
                _id: this.thisTeam._id
            }
            tournamentService.leaveTeamFromTournament(this.currentTournament._id, data)
                .then(response => {
                console.log(response.data);
                })
                .catch(e => {
                    console.log(e)
            })
        },

    },
    mounted() {
        this.getAllPublishedTournaments()
        this.getOneUser(this.currentUser._id)
        this.getAllUsers()
        this.getAllTeams()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        },
        showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }
      return false;
        },
        showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }
      return false;
        },
        searchUsers() {
      if (this.searchName === '') {
        return []
      }
      return this.allUsers.filter(user => {
        return user.username.toLowerCase().indexOf(this.searchName.toLowerCase()) != -1
      })
        },
        searchTeams() {
      if (this.searchName === '') {
        return []
      }

      return this.allTeams.filter(team => {
         return team.name.toLowerCase().indexOf(this.searchName.toLowerCase()) != -1 
        })
    },
    },
    created() {
        var test = document.body;
        test.style.backgroundImage = `url(${require('@/assets/background6.png')})`
        test.style.backgroundRepeat = "no-repeat"
        test.style.backgroundAttachment = "fixed"
        // test.style.backgroundPosition = "center"
        
        // document.body.style.backgroundColor = "#303033"
  },
}
</script>

<style scoped>
.tournament-searcher{
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: roboto;
    margin-top: 5em;
}

.main{
    /* max-width: 80em; */
    /* margin top,right,bottom,left */
    /* margin-top: 6em;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto; */
    height: 36em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: roboto;
}

.tournament-list-box{
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 500ms ease-in-out;
}

.tournaments-list{
    height: 28em;
    width: 24em;
    margin-right: 2em;
    margin-left: 2em;
    background-color: #1a1a1d;
    text-align: center;
    box-shadow: 0px 0px 12px 1px #950740;
}

.row-picture{
    height: 12em;
}

.row-title{
    margin : 0;
    margin-top: 1em;
    background-color: #c3073f;
}

.row-startTime{
    margin-top: 1em;
}

.row-details-titles{
    margin-top: 1em;
}

.row-buttons{
    margin-top: 2em;
}

.active{
    box-shadow:0px 0px 24px 1px #c3073f;
}

.tournament-image{
    width: 24em;
    height: 12em;
}

.join-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.join-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.leave-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.leave-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.tournament-searcher{
    margin-bottom: 1em;  
    width: 100%;
}
.input-tournament-name{
    background-color: #1a1a1d;
    color: white;
    border-color: #6f2232;
}
::placeholder{
    color: white;
}
.btn-outline-dark{
    color: white;
    border-color:#6f2232;
    background-color: #1a1a1d;
    margin-left: 1em;
}
 .inline{
    display: inline-block;
 }

 .tournament-pagination{
    float: right;
 }

 .pagination-button{
    border-radius: 100%;
    color: white;
    background-color: #1a1a1d;
    border-color: #6f2232;
    width: 4em;
    height: 4em;
 }

 .select-item{
    border-radius: 25%;
    color: white;
    background-color: #1a1a1d;
    border-color: #6f2232;
 }

 .tournament-list-page{
    color: white;
    text-align: center;
 }

 .tournament-list-transition-enter-from,
.tournament-list-transition-leave-to{
    transform: translateX(-20px);
    opacity: 0;
}

.tournament-list-transition-enter-active
.tournament-list-transition-leave-active{
    transition: all 0.5s ease-out;
}

.searcher-transition-enter-from,
.searcher-transition-leave-to{
  transform: translateY(-10px);
    opacity: 0;
}

.searcher-transition-enter-active,
.searcher-transition-leave-active{
  transition: all 0.5s ease-out;
}

.avatar{ 
  max-width: 2em;
  max-height: 2em;
  border-radius: 66px;
}

.searchBar{
    margin-top: 0;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
}

.searchBar-searcher{
    display: flex;
    text-align: center;
    justify-content: center;
}

.searcher{
 height: 2em;
 width: 60%;
 border-radius: 15px;
 border-color: black;
 text-align: center;
}

.search-list{
  border-radius: 5px;
  color: white;
  background-color: #1a1a1d;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  z-index: 50;
  overflow: auto;
  transition: all 300ms ease-in-out;
}

.tournament-player-list{
    list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 0; /* Remove margins */
}

.labelInfo{
    color:white;
    text-align: center;
}

.users-list{
    margin-top: 0.5em;
}

.player-options{
    display: inline-block;
    margin-left: 2em;
}

.kick-player-button{
    margin-left: 1em;
}

.teamName{
    margin-left: 0.5em;
}

/* @media (max-width:1500px){
    .tournaments-list{
    margin-right: 1.5em;
    margin-left: 1.5em;
}
}

@media (max-width:1450px){
    .tournaments-list{
    margin-right: 1em;
    margin-left: 1em;
}
}

@media (max-width:1400px){
    .tournaments-list{
    width: 22em;
}
.tournament-image{
    width: 22em;
}
}

@media (max-width:1300px){
    .tournaments-list{
    width: 20em;
}
.tournament-image{
    width: 20em;
}
}

@media (max-width:1200px){
    .tournaments-list{
    width: 18em;
}
.tournament-image{
    width: 18em;
}
}

@media (max-width:1100px){
    .tournaments-list{
    width: 16em;
    height: 26em;
}
.tournament-image{
    width: 16em;
    height: 12em;
}
} */



</style>