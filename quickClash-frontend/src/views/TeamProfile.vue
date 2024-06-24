<template>
<div class="wrapper">
            <div class="your-team">
                <div class="after_txt">
                <h2>{{currentTeam.name}} / {{currentTeam.tag}}</h2>
                <p><strong>OWNER:</strong></p>
                <div class="member-box">
                        <div class="member-avatar">
                            <img class="avatar" v-if="teamOwner.faceitAvatar != '' " :src="teamOwner.faceitAvatar" />
                            <img class="avatar" v-if="teamOwner.faceitAvatar == '' " :src="require('@/assets/unknown.jpg')" />
                        </div>
                        <div class="member-username"> 
                            {{teamOwner.username}}
                        </div>
                        <div class="member-verified">
                            {{teamOwner.faceitVerified ? "Verified" : "Not verified"}}
                        </div>
                        </div>
                <p><strong>MEMBERS:</strong></p>
                <div class="members-list">
                <div class="row">
                    <!-- LIST OF TEAM MEMBERS -->
                    <div class="col-sm"
                    v-for="(friend,index) in teamPlayers"
                    :key="index">
                        <div class="member-box">
                        <div class="member-avatar">
                            <img class="avatar" v-if="friend.faceitAvatar != '' " :src="friend.faceitAvatar" />
                            <img class="avatar" v-if="friend.faceitAvatar == '' " :src="require('@/assets/unknown.jpg')" />
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
            
                </div>
                
                </div>
            </div>
    </div>
</template>

<script>
import teamService from '@/services/team.service';
import userService from '@/services/user.service';
export default {
    name: "TeamProfile-comp",
    data() {
        return {
            currentTeam: [],
            teamOwner: [],
            teamPlayers: [],
        }
    },
    methods: {
        getCurrentTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.currentTeam = response.data
                // console.log(response);
                    this.getTeamOwner(this.currentTeam.owner)
                    this.getTeamPlayers()
            })
        },
        getTeamOwner(id) {
            userService.findOneUser(id)
                .then(response => {
            this.teamOwner = response.data
         })   
        },
        getTeamPlayers() {
            for (var i = 0; i < this.currentTeam.players.length; i++){
                userService.findOneUser(this.currentTeam.players[i])
                    .then(response => {
                    this.teamPlayers.push(response.data)
                })
            }
        }
    },
    mounted() {
      this.getCurrentTeam(this.$route.params.id)  
    },
    computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    },
}
</script>

<style scoped>
.wrapper{
    margin-top: 6em;
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
    margin-top: 2em;
}
</style>