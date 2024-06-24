<template>
<div class="welcome">
    <h2>INFO ABOUT YOUR TEAM</h2>
</div>
<div class="team-info">
    <p><strong>NAME:</strong>{{currentTeam.name}}</p>
    <p><strong>TAG:</strong>{{currentTeam.tag}}</p>
    <p><strong>OWNER:</strong>{{owner.username}}</p>
    <p><strong>MEMBERS:</strong></p>
    <div class="row" id="main">
        <div class="col">
      <ul class="list-group" id="myTeam-comp">
            <li class="list-group-item" id="itemsv2" 
        :class="{ active: index == currentIndex}"
        v-for="(friend,index,) in players"
        :key="index"
        @click="setActiveUser(friend, index)"
        >
        {{friend.username}}
        </li>
        </ul>
        </div>
          <div class="col" id="players-buttons">
            <div class="players-options" v-if="thisPlayer">
  <ul class="list-group" id="myTeam-comp">
            <li class="list-group-item" id="optionsv2" 
        v-for="(friend,index) in players"
        :key="index"
        >
       <button v-show="thisPlayer.username == friend.username && thisPlayer.username !== owner.username" @click="removeFromTeam()">Remove</button>
        </li>
        </ul>
        </div>

        </div>
        </div>
</div>

</template>

<script>
import teamService from "@/services/team.service"
import userService from "@/services/user.service"
export default {
    name: "myTeam-comp",
    data() {
        return {
            thisCurrentUser: [],
            currentTeam: [],
            thisUser: null,
            currentIndex: -1,
            owner: [],
            players: [],
            thisPlayer: null,
        }
    },
    methods: {
         getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                // console.log(response.data)

                //GET INFORMATIONS ABOUT OWNER
                    this.findOwnerUsername()
                })
                .catch(e => {
                console.log(e)
            })
        },
         //Get team from rout
        getOneTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.currentTeam = response.data
                // console.log(response.data)
                
                //GET INFORMATIONS ABOUT PLAYERS
                this.findPlayersUsernames()
                })
                .catch(e => {
                console.log(e)
            })
        },
        findOwnerUsername() {
            userService.findOneUser(this.thisCurrentUser._id)
                .then(response => {
                    this.owner = response.data
                    // console.log(this.owner)
            })
        },
        findPlayersUsernames() {
            for (var i = 0; i < this.currentTeam.players.length; i++){
                userService.findOneUser(this.currentTeam.players[i])
                    .then(response => {
                        this.players.push(response.data)
                })
            }  
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
         reloadPage() {
      window.location.reload();
    },
    },
     mounted() {
        this.getOneUser(this.currentUser._id) 
        this.getOneTeam(this.$route.params.id)
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
#main{
    max-width: 20em;
}

#itemsv2 {
 display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 50px;
      margin-bottom: 8px;
      margin-left: 0.2em;
      cursor: pointer;
      color: #fefefe;
      background-color: #242424;
}

#optionsv2 {
    display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      margin-bottom: 8px;
      color: #fefefe;
      background-color: rgb(255, 255, 255);  
      margin-left: 1em;
      border: none !important;
}
</style>