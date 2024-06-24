<template>
    <div class="navBar" id="navBar">
        <nav ref="headRef" class="navbar navbar-expand navbar-dark bg-dark">
      <a class="navbar-brand">QuickClash</a>
      <div class="navbar-nav mr-auto">
        <li v-if="currentUser" class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" /> <div class="changedResolution" style="display: inline-block">Home</div>
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin" class="nav-link">
            <font-awesome-icon icon="wrench" />  <div class="changedResolution" style="display: inline-block">Admin Board</div>
          </router-link>
        </li>
        <!-- <li v-if="showModeratorBoard" class="nav-item">
          <router-link to="/mod" class="nav-link">Moderator Board</router-link>
        </li> -->
        <!-- <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li> -->
        <li class="nav-item">
          <router-link v-if="currentUser" to="/premium" class="nav-link">
            <font-awesome-icon icon="crown" />
            <div class="changedResolution" style="display: inline-block">Premium</div>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/ranking" class="nav-link">
            <font-awesome-icon icon="ranking-star" />
            <div class="changedResolution" style="display: inline-block">Ranking</div>
          </router-link>
        </li>
        <!-- SEARCHBAR -->
        <div class="searchBar" v-if="currentUser">
        <input class="searcher" type="text" id="search" placeholder="Search ..." v-model="searchName" />
        <transition name="searcher-transition">
        <div class="search-list" v-if="searchName !== ''">
        <div v-if="searchName !== '' && searchUsers.length == 0 ">Nothink found</div>
        <div v-if="searchName !== '' && searchUsers.length > 0">Users:</div>
        <ul>
          <li class="users-list"
              :class="{ active: index == currentIndex}"
              v-for="(user, index) in searchUsers" :key="index"
              @click="setActiveUser(user,index)">
                <img class="avatar" v-if="user.faceitAvatar != '' " :src="user.faceitAvatar" />
                <img class="avatar" v-if="user.faceitAvatar == '' || user.faceitAvatar == undefinied " :src="require('@/assets/unknown.jpg')" />
                 {{user.username}}
          </li>
        </ul>
        <div v-if="searchName !== '' && searchTeams.length > 0">Teams:</div>
        <ul>
          <li class="teams-list"
              :class="{ active: index == currentIndex}"
              v-for="(team, index) in searchTeams" :key="index"
              @click="setActiveTeam(team,index)">
              <img class="avatar" v-if="team.ownerAvatar != '' " :src="team.ownerAvatar" />
                {{team.name}}
          </li>
        </ul>
        </div>
      </transition>
        </div>
      </div>
      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>
      <div v-if="currentUser" class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link to="/team" class="nav-link">
          <font-awesome-icon icon="people-group" />
          <div class="changedResolution" style="display: inline-block">Team</div>
        </router-link>
      </li>
      <!-- <li class="nav-item">
        <router-link to="/friends" class="nav-link">
         <font-awesome-icon icon="magnifying-glass" />
          Search Friends
        </router-link>
      </li> -->
      <li class="nav-item" @click="$emit('toggleBar')">
      <div class="nav-link" id="friends">
        <font-awesome-icon icon="handshake" />
        <div class="changedResolution" style="display: inline-block">Friends</div>
        </div>
      </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            <div class="changedResolution" style="display: inline-block">{{ currentUser.username }}</div>
          </router-link>
        </li>
        <li class="nav-item" @click="$emit('toggleNotifications')">
          <div class="nav-link" id="notifications" >
            <font-awesome-icon icon="bell"  :class="{'noNotification': !marker, 'notification': marker}"  />
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> <div class="changedResolution" style="display: inline-block">logOut</div>
          </a>
        </li>
      </div>
    </nav>
    </div>
</template>

<script>
import userService from '@/services/user.service';
import teamService from '@/services/team.service';
import socketioService from '@/services/socketio.service';
export default {
    name: "NavBar-comp",
    data() {
        return {
          searchName: "",
          allUsers: [],
          allTeams: [],
          thisUser: null,
          thisTeam: null,
          currentIndex: -1,
          notifications: [],
          marker: false,
        }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  
    stickyNavbar() {
      var prev = window.pageYOffset
      const refs = this.$refs.headRef
      window.addEventListener("scroll", () => {
        var curr = window.pageYOffset;
          if (prev > curr) {
            refs.classList.add("scroll-up");
            refs.classList.remove("scroll-down");
          } else {
            refs.classList.add("scroll-down");
            refs.classList.remove("scroll-up");
          }
          if (curr === 0) {
            refs.classList.remove("scroll-down");
            refs.classList.remove("scroll-up");
          }
            prev = curr;
      })
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
    setActiveUser(user, index) {
            this.thisUser = user
            this.currentIndex = index
      // console.log(this.thisUser)
      this.goToProfile()
            this.searchName = ""
    },

    goToProfile() {
          this.$router.push({name:'UserProfile', params: {id: this.thisUser._id}});
    },

    setActiveTeam(team, index) {
      this.thisTeam = team
      this.currentIndex = index
      // console.log(this.thisTeam);
      this.goToTeamProfile()
      this.searchName = ""
    },
    goToTeamProfile() {
        this.$router.push({name:'TeamProfile', params: {id: this.thisTeam._id}})
    },

    getNotificationSocket() {
      socketioService.socket.on("getNotification", (data) => {
        this.notifications = []
        this.notifications.push({
          marker: data.marker
        })
        this.marker = data.marker
      })
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
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
  mounted() {
    this.stickyNavbar()
    this.getAllUsers()
    this.getAllTeams()
    this.getNotificationSocket()
  },
};
</script>

<style scoped>

.navbar{
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  transition: all 300ms ease-in-out;
  z-index: 100;
  background-color: #1a1a1d !important;
  -webkit-box-shadow:0px 1px 1px #950740;
 -moz-box-shadow:0px 1px 1px #950740;
 box-shadow:0px 1px 12px #c3073f;
}



.scroll-up {
  /* transform: translate3d(0, -100%, 0); */
  filter: drop-shadow(0 -10px 60px #6f2232)
}

.navbar-brand{
  color: white !important;
}

#friends {
  cursor: pointer;
}

.searcher{
  margin-left: 1em;
  margin-top: 0.2em;
 max-width: 16em;
 max-height: 4em;
 height: 2em;
 width: 14em;
 border-radius: 15px;
 border-color: black;
 text-align: center;
}

.search-list{
  position: fixed;
  margin-top: 1em;
  margin-left: 1em;
  border-radius: 5px;
  color: white;
  background-color: #1a1a1d;
  border: 1px solid white;
  box-shadow: 0px 0px 4px 1px white;
  height: 10em;
  width: 14em;
  z-index: 50;
  overflow: auto;
  transition: all 300ms ease-in-out;
}

.users-list{
  cursor: pointer;
}

.teams-list{
  cursor: pointer;
}

.notification{
  color: rgb(251, 65, 65);
}

#notifications{
  cursor: pointer;
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

@media (max-width:1180px){
  .changedResolution {
            display: none !important;
        }

    }

    @media (max-width:670px){
  .navbar-brand {
            display: none !important;
        }

    }

    @media (max-width:560px){
  .searchBar {
            display: none !important;
        }

    }

</style>