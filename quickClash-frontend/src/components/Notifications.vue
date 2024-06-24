<template>
    <transition name="notifications-transition">
    <div class="notifications" v-if="open">
        <div class="close">
            <button id="close-notifications" class="customButton" @click="$emit('toggleNotifications')"><font-awesome-icon icon="rectangle-xmark" /></button>
        </div>
        <h4 id="notification-title">Notifications</h4>
        <div class="notifications-empty" v-if="allNotifications.length == 0">You don't have any notifications</div>
        <div>
            <div class="notifications-list" 
                :class="{ active: index == currentIndex}"
                v-for="(notification,index) in allNotifications" :key="index"
                @click="setActiveNotification(notification,index)">
                <div class="notification-txt">
                    {{notification.senderName}} invite you to friends!
                </div>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import userService from '@/services/user.service'
import socketioService from '@/services/socketio.service'
import notificationService from '@/services/notification.service'

export default {
    props: [
        "open"
    ],
    name: "Notifications-comp",
    data() {
        return{
            thisCurrentUser: [],
            thisNotification: null,
            currentIndex: -1,
            currentNotification: null,
            allNotifications: [],
        }
    },
    methods: {
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

        getNotifications(id) {
            notificationService.getReceiverNotification(id)
                .then(response => {
            this.allNotifications = response.data
          })
        },

        getFriendsInviteSocket() {
            socketioService.socket.on("getFriendsInvite", (data) => {
                this.allNotifications.push({
                    sender: data.senderId,
                    senderName: data.senderName,
                });
                // console.log(this.allNotifications);
            })
        },

        deleteSenderNotification(id) {
            notificationService.deleteSenderNotification(id)
                .then(response => {
                console.log(response);
            })
        },

        setActiveNotification(notification, index) {
            this.thisNotification = notification
            this.currentIndex = index
            console.log(this.thisNotification);
            this.goToProfile()
            this.deleteSenderNotification(this.thisNotification.sender)
            this.$nextTick(function () {
                this.getNotifications(this.thisCurrentUser._id)
            })
        },

        sendNotificationSocket() {
            if (this.allNotifications.length > 0) {
                const receiverId = this.thisCurrentUser._id
                socketioService.socket.emit("sendNotification", {
                    receiverId,
                    marker: true
                })
            } else {
                const receiverId = this.thisCurrentUser._id
                socketioService.socket.emit("sendNotification", {
                    receiverId,
                    marker: false
                })
            }
        },

        goToProfile() {
          this.$router.push({name:'UserProfile', params: {id: this.thisNotification.sender}});
        },
        log(message) {
            console.log(message);
        },
    },
    mounted() {
        this.getOneCurrentUser(this.currentUser._id) 
        this.getNotifications(this.currentUser._id)
        this.getFriendsInviteSocket() 
        this.$watch("allNotifications.length", () => {
                    this.sendNotificationSocket()
                });
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>

<style scoped>

.notifications{
    position:fixed;
    top: 7%;
    right: 0;
    transition: all 300ms ease-in-out;

   display: flex;
    justify-content: flex-start;
    /* align-items: center; */
    flex-direction: column;
    width: 250px;
    height: calc(50vh - 56px);
    padding-top: 12px; 
    z-index: 11;
     overflow-y: scroll;
     overflow-x: hidden;
     background-color: #1a1a1d; 
     color: white;
     font-family: roboto;
     -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:0px 0px 12px 1px white;
}

.notifications-empty{
    color: white !important;
}

.customButton {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 2px #c3073f) drop-shadow(0 0 4px #c3073f) ;
  transition: .5s;
}

.customButton:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

#close-notifications{
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    float: right;
}

#notification-title{
    text-align: center;
}

.notifications-empty{
    text-align: center;
    color: rgb(40, 40, 40);
}

.notification-txt{
    cursor: pointer;
    text-align: center;
    margin-bottom: 1em;
    font-family: roboto;
    font-size: 18px;
    color: #c3073f;
    border-bottom: 1px solid #c3073f;
}

.notifications-transition-enter-from,
.notifications-transition-leave-to{
    transform: translateY(-20px);
    opacity: 0;
}

.notifications-transition-enter-active
.notifications-transition-leave-active{
    transition: all 0.5s ease-out;
}


</style>