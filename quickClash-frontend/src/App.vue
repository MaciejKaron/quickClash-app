<template>
 <div id="app">
   <NavBar @toggleBar="sideBarOpen = !sideBarOpen" @toggleNotifications="notificationsOpen = !notificationsOpen" />
   <RightSideBar v-if="loggedIn" @toggleBar="sideBarOpen = !sideBarOpen" :open="sideBarOpen" @toggleChat=RightSideChatOpen() />
   <ChatBar v-if="loggedIn" @toggleChat="chatOpen = !chatOpen" :openChat="chatOpen" />
   <teamInvite v-if="loggedIn" @toggleInvite="inviteOpen = true" @toggleInviteClose="inviteOpen = false" :open="inviteOpen" />
   <Notifications v-if="loggedIn" @toggleNotifications="notificationsOpen = !notificationsOpen" :open="notificationsOpen" />

    <div class="container">
      <router-view :key="$route.path"/>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import RightSideBar from './components/RightSideBar.vue'
import ChatBar from './components/ChatBar.vue'
import teamInvite from './components/teamInvite.vue'
import socketioService from './services/socketio.service'
import { ref } from 'vue'
import Notifications from './components/Notifications.vue'
// import { chat } from './store/chat'
export default {
  name: "App",
  data() {
    return {
      sideBarOpen: false,
      chatOpen: ref(false),
      inviteOpen: false,
      notificationsOpen: false,
  }
  },
  components: {
    NavBar,
    RightSideBar,
    ChatBar,
    teamInvite,
    Notifications
},
  methods: {
    RightSideChatOpen() {
      if (this.chatOpen == false) {
        this.chatOpen = true
      } else {
        this.chatOpen = false
         this.$nextTick(function () {
                    this.chatOpen = true
                     })
      }
    },
    reloadPage() {
      window.location.reload();
        },
  },
created() {
  socketioService.setupSocketConnection()
  
  // document.body.style.backgroundColor = "#303033"
  var test = document.body;
  test.style.backgroundImage = `url(${require('@/assets/background6.png')})`
  test.style.backgroundRepeat = "no-repeat"
  test.style.backgroundAttachment = "fixed"
  },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
}
</script>

<style>
.container{
  margin-top: 4em;
  max-width: 100%;
  height: 100%
}

/* custom SCROLLBAR */

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #141417;
  border: 0.01px solid grey;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #950740;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c3073f;
}

/* //notification toasts */
.v-toast__item--success {
    background-color: #141417 !important;
    box-shadow: 0px 0px 12px 1px #c3073f !important;
    color: white !important;
    margin-top: 4em !important;
    max-width: 14em !important;
}

.v-toast__item--error {
    background-color: #6f2232 !important;
    box-shadow: 0px 0px 24px 2px #141417 !important;
    color: white !important;
    margin-top: 4em !important;
    max-width: 14em !important;
}


</style>
