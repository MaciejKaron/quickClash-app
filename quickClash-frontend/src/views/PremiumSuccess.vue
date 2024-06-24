<template>
    <div class="premium-success-main">
    <div class="fireworks-image">
        <img class="firework-image" :src="imagePath"  />
    </div>
    <div class="premium-success-box">
        <div class="premium-success">
        <h2 class="thanks-txt">Thank you so much for support !</h2>
        <div>
        <button class="premium-success-button" @click="back()">Back</button>
        </div>
        </div>
    </div>
    <div class="fireworks-image">
        <img class="firework-image" :src="imagePath"  />
    </div>
    </div>
</template>

<script>
import userService from '@/services/user.service'
export default {
    name: "PremiumSuccess-comp",
    data() {
        return {
            thisCurrentUser: [],
            imagePath: require('@/assets/fireworks3.gif')
        }
    },
    methods: {
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        updateToPremium() {
            var data = {
                vip: true
            }
            userService.updateUser(this.currentUser._id, data)
                .then(response => {
                console.log(response);
                })
                .catch(e => {
                console.log(e);
            })
        },
        back() {
            this.$router.push({name: 'premium'})
        }
    },
    mounted() {
        this.getOneUser(this.currentUser._id) 
       this.updateToPremium()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        },
    },
    created() {
    document.body.style.backgroundColor = "#303033";
  },
}
</script>

<style scoped>
.premium-success-main{
    color: white;
    text-align: center;
    font-family: roboto;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40em;
}

.premium-success-button {
    margin-top: 1em;
  background-color: #063158;
  color: white;
  border: 2px solid #073a67;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #084276) drop-shadow(0 0 8px #084276) ;
  transition: .5s;
  width: 10em;
  height: 2em;
  font-size: 36px;
}

.premium-success-button:hover {
  color: white;
  background-color: #084276;
  filter: drop-shadow(0 0 6px #073a67);
}

.fireworks-image{
    display: inline-block;
}

.firework-image{
    width: 32em;
}

.thanks-txt{
    display: inline-block;
}

.premium-success-box{
    display: inline-block;
}
</style>