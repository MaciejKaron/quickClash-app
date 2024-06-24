<template>
    {{openInviteWindow()}}
    <div class="containerv3" v-if="open">
  <div class="childv3">
    <div class="invite-text">
    {{senderUsername.username}} send you a party invite to {{teamName.name}}
    </div>
    <div class="invite-buttons">
        <button class="inviteButton" id="invite-accept" @click="confirmTeamInvitation(); closeInviteWindow(); sendInfoSocketConfirm()">Accept</button>
        <button class="inviteButton" id="invite-refuse" @click="declineTeamInvitation(); closeInviteWindow(); sendInfoSocketDecline()">Refuse</button>
    </div>
  </div>
</div>
</template>

<script>
import socketioService from '@/services/socketio.service'
import userService from '@/services/user.service'
import teamService from '@/services/team.service'
export default {
    props: [
        'open'
    ],
    emits: [
        "toggleInvite",
        "toggleInviteClose"
    ],
    name: "teamInvite-comp",
    data() {
        return {
            invite: [],
            invited: false,
            senderUsername: [],
            teamName: [],
            thisCurrentUser: []
        }
    },
    methods: {
        getInviteSocket() {
            socketioService.socket.on("getInvite", (data) => {
                this.invite.push({
                    sender: data.senderId,
                    team: data.teamId,
                    delete: data.deleteInvite
                })
            if (this.invite.length > 0) {
                this.invited = true
                }
                this.findSenderName()
                this.findTeamName()
                if (data.deleteInvite == true) {
                this.closeInviteWindow()
            }
            })
        },
        openInviteWindow() {
            if (this.invited == true) {
            this.$emit('toggleInvite')
          }  
        },
        closeInviteWindow() {
            this.invited = false
            this.$emit('toggleInviteClose') 
        //   console.log(this.invited) 
        },

        findSenderName() {
            if (this.invited == true) {
                userService.findOneUser(this.invite[0].sender)
                    .then(response => {
                        this.senderUsername = response.data
                        // console.log(this.senderUsername.username);
                    })
            }
        },

        findTeamName() {
            if (this.invited == true) {
                teamService.findOneTeam(this.invite[0].team)
                    .then(response => {
                        this.teamName = response.data
                    // console.log(this.teamName.name);
                })
            }
        },
        getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                this.thisCurrentUser = response.data;
            })
                .catch(e => {
                console.log(e);
            });
        },

        confirmTeamInvitation() {
            var data = {
                _id: this.teamName._id
            }
            teamService.confirmTeamInvitation(this.thisCurrentUser._id, data)
                .then(response => {
                    console.log(response)
                this.reloadPage()
                })
            .catch(e => {
                console.log(e);
            })
        },

        declineTeamInvitation() {
           var data = {
                _id: this.teamName._id
            }
            teamService.declineTeamInvitation(this.thisCurrentUser._id, data)
                .then(response => {
                console.log(response)
                }) 
            .catch(e => {
                console.log(e);
            })
        },

        sendInfoSocketConfirm() {
            for (var i = 0; i < this.teamName.players.length; i++) {
                const receiverId = this.teamName.players[i]
                socketioService.socket.emit("sendInfo", {
                    receiverId,
                    teamInviteSend: false,
                    isInTeam: true,
                    newPlayer: this.thisCurrentUser._id
                })
            }
        },
        sendInfoSocketDecline() {
            for (var i = 0; i < this.teamName.players.length; i++) {
                const receiverId = this.teamName.players[i]
                socketioService.socket.emit("sendInfo", {
                    receiverId,
                    teamInviteSend: false,
                    isInTeam: false
                })
            }
        },

        goToYourTeam() {
            this.$router.push({path: '/team'});
        },
        reloadPage() {
      window.location.reload();
        }
    },
    mounted() {
        this.getOneCurrentUser(this.currentUser._id)
        this.getInviteSocket()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
}
</script>

<style scoped>

.containerv3 {
    position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 30;
}

.childv3 {
  width: 40em;
  height: 10em;
  background-color: #1a1a1d;
  color: white;
  box-shadow: 0px 0px 12px 1px white;
  font-family: roboto;
  font-size: 18px;
  /* Center vertically and horizontally */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
}

.invite-text{
    margin-top: 2em;
    text-align: center;
}

.invite-buttons{
    display: flex;
    justify-content: center;
    margin-top: 4em;
}

#invite-refuse{
    margin-left: 1em;
}

.inviteButton {
        cursor: pointer;
        background-color: #6f2232;
        color: white;
        border: 2px solid #950740;
        border-radius:5px;
        cursor: pointer;
        filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
        transition: .5s;
    }

    .inviteButton:hover {
        color: white;
        background-color: #c3073f;
        filter: drop-shadow(0 0 6px #950740);
    }
</style>