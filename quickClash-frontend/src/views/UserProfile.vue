<template>
<div v-if="thisUser" class="userProfile-main">
<div class="user-is-not-verified" v-if="thisUser.faceitVerified == false || thisUser.faceitVerified == undefinied">
    <div class="user-card">
        <img class="userProfile-avatar" v-if="thisUser.faceitAvatar == '' || thisUser.faceitAvatar == undefinied " :src="require('@/assets/unknown.jpg')" />
        <div class="user-nickname">
        <h2>{{thisUser.username}}</h2>
        </div>
    </div>
    <h2 class="welcome-no-verified">This user has not binded their account with faceit</h2>
</div>
<div class="faceit-info" v-if="this.thisUser.faceitVerified == true">
      <div class="user-premium" v-show="thisUser.vip == true">
        <font-awesome-icon class="faa-float animated faa-slow" id="crown-icon" icon="crown" />
      </div>
      <div class="user-card">
    <div class="user-avatar">
        <img class="userProfile-avatar" v-if="thisUser.faceitAvatar != '' " :src="thisUser.faceitAvatar" />
        <img class="userProfile-avatar" v-if="thisUser.faceitAvatar == '' || thisUser.faceitAvatar == undefinied " :src="require('@/assets/unknown.jpg')" />
    </div>

    <div class="user-nickname">
    <h2>{{thisUserInfo.nickname}}</h2>
    </div>

    <div class="user-skill" :class="{red: thisStats.skill_level == 10, orange: thisStats.skill_level >= 4 && thisStats.skill_level < 10, green: thisStats.skill_level > 0 && thisStats.skill_level < 4}">
    <h4>Skill level: {{thisStats.skill_level}}</h4>
    </div>

    <div class="user-elo">
    <h5>Faceit elo: {{thisStats.faceit_elo}}</h5>
    </div>
  </div>

  <div class="user-stats">
    <div class="user-matches user-stat">
      Matches
      <br>
      {{thisGameStats.Matches}}
    </div>

    <div class="user-wins user-stat">
      Wins
      <br>
      {{thisGameStats.Wins}}
    </div>

    <div class="user-kd user-stat">
      K/D Ratio
      <br>
      {{thisGameStats["Average K/D Ratio"]}}
    </div>

    <div class="user-headshots user-stat">
      Average Headshots
      <br>
      {{thisGameStats["Average Headshots %"]}}%
    </div>

    <div class="user-winStreak user-stat">
      Longest win streak
      <br>
      {{thisGameStats["Longest Win Streak"]}}
    </div>
  </div>
    </div>

    <div class="user-match-history" v-if="this.thisUser.faceitVerified == true">
      <h2 style="color: #c3073f; text-align: center;">Match History</h2>
      <div class="user-matches-list">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>
                        Nickanme
                    </th>
                    <th>
                        Kills 
                    </th>
                    <th>
                        Deaths
                    </th>
                    <th>
                        K/D Ratio 
                    </th>
                    <th>
                        Map
                    </th>
                    <th>
                        Date
                    </th>
                    <th>
                        Opponent
                    </th>
                    <th>
                        Result
                    </th>
                </tr>
            </thead>
            <tbody class="table-rows">
                <tr v-for="(match,index) in userMatchHistory" :key="index">
                    <td>
                        {{match.player.playerUsername}}
                    </td>
                    <td>
                        {{match.playerStats.kills}}
                    </td>
                    <td>
                      {{match.playerStats.deaths}}
                    </td>
                    <td>
                      <div class="positive-ratio" v-if="((match.playerStats.kills/match.playerStats.deaths) >= 1)">
                        {{(match.playerStats.kills/match.playerStats.deaths).toFixed(1)}}
                      </div>
                      <div class="negative-ratio" v-if="((match.playerStats.kills/match.playerStats.deaths) < 1)">
                        {{(match.playerStats.kills/match.playerStats.deaths).toFixed(1)}}
                      </div>
                    </td>
                    <td>
                      {{match.map}}
                    </td>
                    <td>
                      {{displayDate(match.createdAt)}}
                    </td>
                    <td>
                      {{match.opponent.opponentUsername}}
                    </td>
                    <td>
                      <div class="winBar" v-if="match.isWin == true">{{match.isWin ? "Win" : "Lose"}}</div>
                      <div class="loseBar" v-if="match.isWin == false">{{match.isWin ? "Win" : "Lose"}}</div>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>

    <h3 v-if="testTabv2.length > 2" style="color: #c3073f; text-align: center; margin-top: 4em;">Kills/Deaths</h3>
    <div class="statistics-graph" v-if="testTabv2.length > 2">
      <Chart
        :size="{ width: 1000, height: 420 }"
        :data="testTabv2"
        :margin="margin"
        :direction="direction"
        :axis="axis">

        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Area :dataKeys="['id', 'kills']"  type="normal" :areaStyle="{ fill: 'url(#grad)' }" />
          <Line :dataKeys="['id', 'kills']" :lineStyle="{ stroke: 'blue' }" type="normal" />
          <Area :dataKeys="['id', 'deaths']"  type="normal" :areaStyle="{ fill: 'url(#gradv2)' }" />
          <Line :dataKeys="['id', 'deaths']" :lineStyle="{ stroke: 'red' }" type="normal" />

          <defs>
        <linearGradient id="grad" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color="#1919ff" stop-opacity="1" />
          <stop offset="100%" stop-color="#b2b2ff" stop-opacity="0.2" />
        </linearGradient>
        <linearGradient id="gradv2" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color="#ff9999" stop-opacity="1" />
          <stop offset="100%" stop-color="#ff1919" stop-opacity="0.2" />
        </linearGradient>
      </defs>
        </template>

        <template #widgets>
          <Tooltip
            borderColor="#48CAE4"
            :config="{
              id: { hide: true },
              kills: { color: '#0077b6' },
              deaths: {  color: 'red' },
            }"
          />
        </template>

      </Chart>
      
    </div>

<div class="addFriend-buttons">
<button class="profile-button-add customButton" v-if="((!thisUser.invitations.includes(thisCurrentUser._id)) && (!thisUser.pendingFriends.includes(thisCurrentUser._id)) && (!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser._id !== thisCurrentUser._id))" @click="addToPending(); sendInviteFriendsSocket(); sendInviteFriendsSocketInfo(); createNotification()">Add to friends</button>
<button class="profile-button-undo customButton" v-if="thisUser.invitations.includes(thisCurrentUser._id)" @click="removeFromPending(); sendInviteFriendsRemoveUndoSocket()">Undo sending the invitation</button>
<button class="profile-button-remove customButton" v-if="thisUser.friends.includes(thisCurrentUser._id)" @click="removeFromFriends(); sendInviteFriendsRemoveUndoSocket()">Remove from friends</button>
<button class="profile-button-decline customButton" v-if="((!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser.pendingFriends.includes(thisCurrentUser._id)))" @click="declineTheInvitation(); sendInviteFriendsAcceptDeclineSocket()">Decline invitation</button>
<button class="profile-button-accept customButton" v-if="((!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser.pendingFriends.includes(thisCurrentUser._id)))" @click="confirmTheInvitation(); sendInviteFriendsAcceptDeclineSocket()">Accept Invitation</button>
</div>
</div>
</template>

<script>
import userService from '@/services/user.service'
import socketioService from '@/services/socketio.service'
import notificationService from '@/services/notification.service'
import faceitService from '@/services/faceit.service'
import moment from "moment"
import matchService from '@/services/match.service';
import { Chart, Grid, Line, Tooltip, Area } from 'vue3-charts'
export default {
    name: "UserProfile-comp",
    components: { Chart, Grid, Line, Tooltip, Area },
    data() {
        return {
            thisUser: null,
            thisCurrentUser: [],
            message: "",
            notifications: [],
            thisStats: [],
            thisUserInfo: [],
            thisGameStats: [],

            userMatchHistory: [],
            testTab: [],
            testTabv2: [],
            direction: 'horizontal',
            margin: {
            left: 0,
            top: 20,
            right: 20,
            bottom: 0
            },
            axis: {
                secondary: {
                domain: ['dataMin', 'dataMax + 15'],
                type: 'linear',
                ticks: 8
                }
            },
        }
    },
    methods: {
        //Get user from rout
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisUser = response.data
                    // console.log(response.data)
                    if (this.thisUser.faceitVerified == true) {
                        this.getMyFaceitStats(this.thisUser._id)
                        this.getGameStats(this.thisUser._id)
                    }
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get current user
          getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                    // console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        addToPending() {
            userService.addToPending(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response.data)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        removeFromFriends() {
            userService.removeFromFriends(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response.data)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        removeFromPending() {
            userService.removeFromPending(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response.data)
                this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
          confirmTheInvitation() {
            userService.confirmTheInvitation(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        declineTheInvitation() {
            userService.declineTheInvitation(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        refreshInformations() {
            this.$nextTick(function () {
                this.getOneUser(this.$route.params.id)
                this.getOneCurrentUser(this.currentUser._id)
            })
        },

        createNotification() {
            var data = {
                sender: this.thisCurrentUser._id,
                senderName: this.thisCurrentUser.username,
                receiver: this.thisUser._id
            }
            notificationService.createNotification(data)
                .then(response => {
                console.log(response)
            })
        },

        sendInviteFriendsSocket() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInvite", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                senderName: this.thisCurrentUser.username,
            })
        },

        sendInviteFriendsSocketInfo() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInfo", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                sended: true
            })
        },

        sendInviteFriendsAcceptDeclineSocket() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInfo", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                accepted: true,
                declined: true
            })
        },

        sendInviteFriendsRemoveUndoSocket() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInfo", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                undo: true,
                removed: true
            })
        },

        getFriendsInviteSocket() {
            socketioService.socket.on("getFriendsInfo", (data) => {
                this.notifications.push({
                    sender: data.senderId,
                    sended: data.sended,
                    accepted: data.accepted,
                    declined: data.declined,
                    removed: data.removed,
                    undo: data.undo
                });
                for (var i = 0; i < this.notifications.length; i++) {
                    if (this.notifications[i].sended == true) {
                        this.refreshInformations()
                        this.refreshInformations()
                        this.refreshInformations()
                    }
                    if (this.notifications[i].accepted == true) {
                        this.refreshInformations()
                    }
                    if (this.notifications[i].declined == true) {
                        this.refreshInformations()
                    }
                    if (this.notifications[i].removed == true) {
                        this.refreshInformations()
                    }
                    if (this.notifications[i].undo == true) {
                        this.refreshInformations()
                    }
                }
            })    
        },
        log(message) {
            console.log(message);
        },

        getMyFaceitStats(id) {
            faceitService.getMyFaceitStats(id)
            .then(response => {
            this.thisUserInfo = response.data
            this.thisStats = response.data.games.csgo
            // console.log(this.thisStats);
            })
        },
        getGameStats(id) {
            faceitService.getGameStats(id)
            .then(response => {
            this.thisGameStats = response.data.lifetime
            // console.log(this.thisGameStats);
            })
        },

        displayDate(value) {
            if (value) {
                return moment(String(value)).format('MM/DD/YYYY hh:mm a')
            }
        },

        findMatchHistory() {
            matchService.findMyAllMatches(this.$route.params.id)
                .then(response => {
                this.userMatchHistory = response.data
                // console.log(response);
                })
                .then(() => {
                    for (let i = 0; i < this.userMatchHistory.length; i++) {
                        this.testTab.push({ kills:this.userMatchHistory[i].playerStats.kills, deaths: this.userMatchHistory[i].playerStats.deaths, id: i + 1, map: this.userMatchHistory[i].map})
                    }
                    this.testTabv2 = this.testTab
                    // console.log(this.testTabv2);
                })
        },
        
    },
    mounted() {
        this.message = ""
        this.getOneUser(this.$route.params.id)
        this.getOneCurrentUser(this.currentUser._id)
        this.getFriendsInviteSocket()
        this.findMatchHistory()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>

<style scoped>
.userProfile-avatar{
  max-width: 7em;
  max-height: 7em;
  border-radius: 66px;
}

.faceit-info{
  max-width: 60em;
    margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    text-align: center;
    font-family: roboto;
    color: white;
}

.userProfile-main{
  margin-top: 5em;
}

.user-card{
  background-color: #1a1a1d;
  margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    max-width: 16em;
    height: 16em;
    border-radius: 5%;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:0px 0px 12px 2px #c3073f;
}

.userProfile-avatar{
  margin-top: 0.5em;
}

.user-nickname{
  margin-top: 0.5em;
}

.red{
  color: red;
}

.orange{
  color: orange;
}

.green{
  color: green;
}

.user-stats{
  margin-top: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-stat{
  margin-left: 1em;
  margin-right: 1em;
  background-color: #1a1a1d;
  display: flex;
  align-items: center;
  justify-content: center;
    width: 10em;
    height: 6em;
    border-radius: 5%;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:0px 0px 2px 1px #c3073f;
}

.customButton {
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

#crown-icon{
  width: 6em;
  height: 6em;
  color: #FFD700;
}

.addFriend-buttons{
    margin-bottom: 2em;
    margin-top: 3em;
    text-align: center;
}

.user-is-not-verified{
    max-width: 60em;
    margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    text-align: center;
    font-family: roboto;
    color: white;
    font-family: roboto;
}

.welcome-no-verified{
    margin-top: 1em;
}

.user-matches-list{
  color: white;
}

.user-match-history{
  margin-top: 2em;
}

table ,tr td{
    border: 0px solid #000;
    text-align: center;
    
}
tbody {
    display:block;
    max-height:18.8em;
    overflow-y:scroll;
}
thead, tbody tr {
    display:table;
    width:100%;
    table-layout:fixed;
}
thead {
    width: calc( 100% - 0.6em )/* scrollbar is average 1em/16px width, remove it from thead width */
}

.table{
    color: white;
    background-color: #1a1a1d;
}

.table-striped tbody tr:nth-of-type(odd) {
    background-color: #17171a;
}
table.table-bordered > thead > tr > th{
    border:1px solid #950740;
}
table.table-bordered > tbody > tr > td{
    border:1px solid #6f2232;
}

.winBar{
  color: green;
}

.loseBar{
  color: red;
}

.positive-ratio{
  color: green;
}

.negative-ratio{
  color: red;
}

.chart{
  color: white;
}

.statistics-graph{
  margin-top: 1em;
  display: flex;
  justify-content: center;
}
</style>