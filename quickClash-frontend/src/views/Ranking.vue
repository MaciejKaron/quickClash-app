<template>
    <h2 class="title">Global Ranking</h2>
    <div class="your-stats">
        <p v-if="thisCurrentUser.faceitVerified == true">
            <img class="ranking-avatar" v-if="thisCurrentUser.faceitAvatar != '' " :src="thisCurrentUser.faceitAvatar" />
            <img class="ranking-avatar" v-if="thisCurrentUser.faceitAvatar == '' || thisCurrentUser.faceitAvatar == undefinied " :src="require('@/assets/unknown.jpg')" />
            Skill level: {{myStats.skill_level}} Elo: {{myStats.faceit_elo}}
        </p>
        <p v-if="thisCurrentUser.faceitVerified == false"> Please bind your account with faceit</p>
    </div>
    <div class="ranking">
        <table class="table table-bordered table-striped" v-if="loaded == true">
            <thead>
                <tr>
                    <th>
                        RANKING 
                    </th>
                    <th>
                        NICKNAME 
                    </th>
                    <th id="col-skill_level" @click="sortList('skill_level')">
                        SKILL_LEVEL 
                        <font-awesome-icon  icon="sort" />
                    </th>
                    <th id="col-faceit_elo" @click="sortList('faceit_elo')">
                        ELO 
                        <font-awesome-icon icon="sort" />
                    </th>
                </tr>
            </thead>
            <tbody class="table-rows">
                <tr v-for="(stats, index) in rankingStats" :key="stats">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>
                        {{ stats.nickname}}
                    </td>
                    <td>
                        {{stats.skill_level}}
                    </td>
                    <td>
                        {{stats.faceit_elo}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import faceitService from '@/services/faceit.service'
import userService from '@/services/user.service'
export default {
    name: "Ranking-comp",
    data() {
        return {
            rankingStats: [],
            loaded: false,
            sortedByAscii: true,
            thisCurrentUser: [],
            myStats: [],
            fields: ["RANKING", "PLAYER", "SKILL_LEVEL", "ELO"]
        }
    },
    methods: {
        
        getRankingStats() {
            faceitService.getRankingStats()
                .then(response => {
                    this.rankingStats = response.data
                    this.loaded = true
            console.log(this.rankingStats);
          })  
        },
        sortList(sortBy) {
            if (this.sortedByAscii) {
                this.rankingStats.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1))
                this.sortedByAscii = false
            } else {
                this.rankingStats.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1))
                this.sortedByAscii = true
            }
        },
        getCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data

                    if (this.thisCurrentUser.faceitVerified == true) {
                    this.getMyFaceitStats(this.thisCurrentUser._id)
                }
            })
        },
        getMyFaceitStats(id) {
            faceitService.getMyFaceitStats(id)
                .then(response => {
                this.myStats = response.data.games.csgo
            })
        },
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
      },
    },
    mounted() {
        this.getRankingStats()
        this.getCurrentUser(this.currentUser._id)
    },
    created() {
    // document.body.style.backgroundColor = "#303033";
    var test = document.body;
        test.style.backgroundImage = `url(${require('@/assets/background6.png')})`
  },
}
</script>

<style scoped>

/* .ranking{
    max-height: 72vh;
    overflow: auto;
} */

table ,tr td{
    border: 0px solid #000
}
tbody {
    display:block;
    max-height:31em;
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


.title{
    color: white;
    text-align: center;
}

#col-skill_level{
    cursor: pointer;
}

#col-faceit_elo{
    cursor: pointer;
}

.your-stats{
    color:white
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

.ranking-avatar{
    max-width: 4em;
  max-height: 4em;
  border-radius: 50%;
  border: 2px solid #950740;
}

</style>