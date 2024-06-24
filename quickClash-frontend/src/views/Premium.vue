<template>
    <div class="get-premium-box">
    <div class="get-premium">
        <div class="premium">
            <div class="premium-icons" v-if="thisUser.vip == true">
            <font-awesome-icon class="faa-pulse animated faa-slow" id="icon-dolar" icon="dollar-sign" />
            <font-awesome-icon class="faa-float animated faa-slow" id="icon-happy" icon="face-laugh-beam" />
            <font-awesome-icon class="faa-pulse animated faa-slow" id="icon-dolar" icon="dollar-sign" />
            </div>
            <h2 class="premium-title">Premium Account</h2>
            <h3 class="premium-price">Only 5$</h3>
            <button v-if="thisUser.vip !== true" class="premium-button" @click="payment()">GET PREMIUM</button>
            <div class="premium-status">
            <label><strong>Status:</strong></label>
            {{thisUser.vip ? "You already have premium!" : "You don't have premium"}}   
        </div>         
        </div>
    </div>
    </div>
    <div class="main" v-if="showAdminBoard">
        <div class="child">
        <h2 class="premium-title">Admin free premium</h2>
        <button class="premium-button" v-if="thisUser.vip" @click="updateToPremium(false)">RESIGN</button>
        <button class="premium-button" v-else @click="updateToPremium(true)">GET PREMIUM</button>
        <div class="premium-status">
            <label><strong>Status:</strong></label>
            {{ thisUser.vip ? "You already have premium!" : "You don't have premium"}}
        </div>
        </div>
    </div>
</template>

<script>
import userService from '@/services/user.service'
import paymentService from '@/services/payment.service'
export default {
    name: "Premium-comp",
    data() {
        return {
            thisUser: [],
            message: "",
        }
    },
    methods: {
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisUser = response.data
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },

        updateToPremium(status) {
            var data = {
                id: this.thisUser._id,
                username: this.thisUser.username,
                password: this.thisUser.password,
                email: this.thisUser.email,
                vip: status,
            }
            userService.updateUser(this.thisUser._id, data)
                .then(response => {
                    this.thisUser.vip = status
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        payment() {
            paymentService.payment()
                .then(response => {
                    if (response) {
                        console.log(response);
                        window.location = response.data.url
                    return response
                    }
                })
        }
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
    },
    mounted() {
        this.message = "",
        this.getOneUser(this.currentUser._id)
    },
    created() {
    // document.body.style.backgroundColor = "#303033";
    var test = document.body;
        test.style.backgroundImage = `url(${require('@/assets/background6.png')})`
  },
}
</script>

<style scoped>
.main {
    color: white;
    background-color: #1a1a1d;
    width: 30em;
    /* margin top,right,bottom,left */
    margin-top: 8em;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
     text-align: center;
     font-family: roboto;
     /* border: 1px solid #950740; */
     box-shadow: 0px 0px 10px 10px #950740;
}

.get-premium-box{
    color: white;
    background-color: #1a1a1d;
    width: 30em;
    /* margin top,right,bottom,left */
    margin-top: 6em;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
     text-align: center; 
     margin-top: 8em;
     font-family: roboto;
     /* border: 1px solid #950740; */
     box-shadow: 0px 0px 10px 10px #950740;
}

.premium-title{
    margin-bottom: 1em;
}

.premium-price{
    margin-bottom: 1em;
}

.premium-button{
    margin-bottom: 1em;
}

.premium-status{
    margin-bottom: 1em;
}

.premium-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.premium-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

#icon-happy{
    height: 4em;
    color: yellow;
}

#icon-dolar{
    height: 3em;
    color: #FFD700;
}

</style>