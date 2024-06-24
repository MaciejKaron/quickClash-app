<template>
    <div class="tournament5v5" v-if="currentTournament.mode == '5v5'">
        <div class="first-bracket">
            <h4 class="title">Round 1</h4>
            <div class="first-teams-list"
                :class="{ active: index == currentIndex}"
                v-for="(team,index) in currentTournamentTeams.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveTeam(team, index)">
                <div :class="{'teams-first-bracket' : currentTournament.slots == 8, 'teams-second-bracket' : currentTournament.slots == 4}">
                    <div class="team-owner-avatar">
                        <img class="team-avatar" :src="team.ownerAvatar" />
                    </div>
                    <div class="team-tag">
                        "{{team.tag}}"
                    </div>
                    <div class="team-name">
                        {{team.name}}
                    </div>
                    <div class="team-level">
                        <font-awesome-icon id="icon-star" icon="star" />
                        {{team.level}}
                    </div>
                    <div class="team-settings" v-if="(thisSelectedTeam._id == team._id) && (showAdminBoard || showModeratorBoard)">
                       <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage2.includes(thisSelectedTeam._id)"><font-awesome-icon icon="wrench" /></button> 
                    </div>
                </div>
            </div>
        </div>
        <div class="second-bracket">
            <h4 class="title">Round 2</h4>
            <div class="first-teams-list"
                :class="{ active: index == currentIndex}"
                v-for="(team,index) in stage2Teams.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveTeam(team, index)">
                <div :class="{'teams-second-bracket' : currentTournament.slots == 8, 'teams-third-bracket' : currentTournament.slots == 4}">
                    <div class="team-owner-avatar">
                        <img class="team-avatar" :src="team.ownerAvatar" />
                    </div>
                    <div class="team-tag">
                        "{{team.tag}}"
                    </div>
                    <div class="team-name">
                        {{team.name}}
                    </div>
                    <div class="team-level">
                        <font-awesome-icon id="icon-star" icon="star" />
                        {{team.level}}
                    </div>
                    <div class="team-settings" v-if="(thisSelectedTeam._id == team._id) && (showAdminBoard || showModeratorBoard)">
                       <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage3.includes(thisSelectedTeam._id)"><font-awesome-icon icon="wrench" /></button> 
                    </div>
                </div>
            </div>
        </div>
        <div class="third-bracket">
            <h4 class="title">Round 3</h4>
            <div class="first-teams-list"
                :class="{ active: index == currentIndex}"
                v-for="(team,index) in stage3Teams.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveTeam(team, index)">
                <div :class="{'teams-third-bracket' : currentTournament.slots == 8, 'teams-fourth-bracket' : currentTournament.slots == 4}">
                    <div class="team-owner-avatar">
                        <img class="team-avatar" :src="team.ownerAvatar" />
                    </div>
                    <div class="team-tag">
                        "{{team.tag}}"
                    </div>
                    <div class="team-name">
                        {{team.name}}
                    </div>
                    <div class="team-level">
                        <font-awesome-icon id="icon-star" icon="star" />
                        {{team.level}}
                    </div>
                    <div class="team-settings" v-if="(thisSelectedTeam._id == team._id) && (showAdminBoard || showModeratorBoard)">
                       <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage4.includes(thisSelectedTeam._id)"><font-awesome-icon icon="wrench" /></button> 
                    </div>
                </div>
            </div>
        </div>
        <div class="fourth-bracket" v-if="currentTournament.slots == 8">
            <h4 class="title">Round 4</h4>
            <div class="first-teams-list"
                :class="{ active: index == currentIndex}"
                v-for="(team,index) in stage4Teams.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveTeam(team, index)">
                <div class="teams-fourth-bracket">
                    <div class="team-owner-avatar">
                        <img class="team-avatar" :src="team.ownerAvatar" />
                    </div>
                    <div class="team-tag">
                        "{{team.tag}}"
                    </div>
                    <div class="team-name">
                        {{team.name}}
                    </div>
                    <div class="team-level">
                        <font-awesome-icon id="icon-star" icon="star" />
                        {{team.level}}
                    </div>
                    <div class="team-settings" v-if="(thisSelectedTeam._id == team._id) && (showAdminBoard || showModeratorBoard)">
                       <button @click="showPopup()" class="match-options-button" ><font-awesome-icon icon="wrench" /></button> 
                    </div>
                </div>
            </div>
        </div>

        <TournamentPopup
                    v-if="isPopupVisible"
                    @close="closePopup()"
                    >
                    <template v-slot:header>
                       
                    </template>

                    <template v-slot:body>
                        <p id="popup-team"><strong>{{thisSelectedTeam.name}}</strong></p>
                        <div class="form-group">
                            <label for="isWin">Win:</label>
                            <input id="match-checkbox" type="checkbox" v-model="match.isWin" @change="handleWin($event)"/>
                        </div>
                        <div class="form-group">
                            <label for="enemyTeam">Enemy team:</label>
                            <select id="enemy-team" v-model="match.enemyTeam" @change="handleEnemyTeam($event)">
                            <option v-for="e in currentTournamentTeams" :key="e" :value="e">{{e.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="roundsWin">Rounds Win:</label>
                            <input type="text" class="form-control" id="rounds-win" required v-model="match.teamRounds.roundsWin" name="rounds-win" />
                        </div>
                        <div class="form-group">
                            <label for="roundsLose">Rounds Lose:</label>
                            <input type="text" class="form-control" id="rounds-lose" required v-model="match.teamRounds.roundsLose" name="rounds-lose" />
                        </div>
                        <div class="form-group">
                            <label for="map">Map:</label>
                            <select id="match-map" v-model="match.map" @change="handleMap($event)">
                            <option v-for="m in mapPool" :key="m" :value="m">{{m}}</option>
                            </select>
                        </div>
                        <div class="popup-options">
                        <button @click="kickTeamFromTournament(); closePopup()" class="match-options-button kick">Kick</button>
                        <button @click="backToStage1(); closePopup()" class="match-options-button undo" v-if="currentTournament.stage.stage2.includes(thisSelectedTeam._id) && !currentTournament.stage.stage3.includes(thisSelectedTeam._id) && !currentTournament.stage.stage4.includes(thisSelectedTeam._id)">Undo2</button>
                        <button @click="backToStage2(); closePopup()" class="match-options-button undo" v-if="currentTournament.stage.stage3.includes(thisSelectedTeam._id) && !currentTournament.stage.stage4.includes(thisSelectedTeam._id)">Undo3</button>
                        <button @click="backToStage3(); closePopup()" class="match-options-button undo" v-if="currentTournament.stage.stage4.includes(thisSelectedTeam._id)">Undo4</button>
                        <button @click="goToStage2(); closePopup()" :disabled="!match.enemyTeam || match.teamRounds.roundsWin == '' || match.teamRounds.roundsLose == '' || match.map == '' " class="match-options-button" v-if="!currentTournament.stage.stage2.includes(thisSelectedTeam._id) && !currentTournament.stage.stage3.includes(thisSelectedTeam._id) && !currentTournament.stage.stage4.includes(thisSelectedTeam._id)">Submit</button>
                        <button @click="goToStage3(); closePopup()" :disabled="!match.enemyTeam || match.teamRounds.roundsWin == '' || match.teamRounds.roundsLose == '' || match.map == '' " class="match-options-button" v-if="currentTournament.stage.stage2.includes(thisSelectedTeam._id) && !currentTournament.stage.stage3.includes(thisSelectedTeam._id) && !currentTournament.stage.stage4.includes(thisSelectedTeam._id)">Submit</button>
                        <button @click="goToStage4(); closePopup()" :disabled="!match.enemyTeam || match.teamRounds.roundsWin == '' || match.teamRounds.roundsLose == '' || match.map == '' " class="match-options-button" v-if="currentTournament.stage.stage3.includes(thisSelectedTeam._id) && !currentTournament.stage.stage4.includes(thisSelectedTeam._id)">Submit</button>
                        </div>
                    </template>

                    <template v-slot:footer>
                    <!-- This is a new modal footer. -->
                    </template>
            </TournamentPopup>

    </div>

    <div class="matchHistory-box">
    <div class="history-info">
        <div class="history-header">Match history</div>
        <button class="match-options-button history-button" @click="cleareHistory()" v-if="showAdminBoard || showModeratorBoard">Clear history</button>
    </div>
    <div class="matchHistory" v-for="(match,index) in matchHistory" :key="index"
        @click="setActiveMatch(match, index)">
        <div class="match-info">
                    {{index + 1}}. {{match.team.teamName}} {{match.isWin ? "Win" : "Lose"}} with {{match.enemyTeam.enemyTeamName}} | Stats: Rounds win: {{match.teamRounds.roundsWin}} Rounds lose: {{match.teamRounds.roundsLose}} | Map: {{match.map}}
            <div class="match-history-options" v-if="(thisMatch._id == match._id) && (showAdminBoard || showModeratorBoard)">
                <button @click="deleteThisMatch()" class="match-options-button match-delete-button">X</button>
            </div>
        </div>
    </div>
    </div>
    
</template>

<script>
import tournamentService from "@/services/tournament.service";
import teamService from '@/services/team.service';
import TournamentPopup from "@/components/TournamentPopup.vue";
import matchService from '@/services/match.service';
export default {
    name: "TournamentInfo5v5-comp",
    components: {
    TournamentPopup,
},
    data() {
        return {
            currentTournament: [],
            currentTournamentTeams: [],
            teamOwnerAvatar: "",
            thisTeam: null,
            currentIndex: -1,
            thisSelectedTeam: [],
            stage2Teams: [],
            stage3Teams: [],
            stage4Teams: [],

            isPopupVisible: false,

            match: {
                tournamentId: null,
                team: null,
                enemyTeam: null,
                teamRounds: {
                    roundsWin: "",
                    roundsLose: "",
                },
                map: "",
                isWin: false,
            },
            mapPool: ["de_dust2", "de_nuke", "de_mirage", "de_ancient", "de_inferno", "de_overpass", "de_train", "de_vertigo"],

            matchHistory: [],
            thisMatch: [],
            currentMatchIndex: -1,
        }
    },
    methods: {
        getOneTournament(id) {
            tournamentService.findOneTournament(id)
                .then(response => {
                    this.currentTournament = response.data
                    // console.log(response.data)
                    this.getTeamsInfos()
                })
                .catch(e => {
                console.log(e)
            })
        },

        getTeamsInfos() {
            for (let i = 0; i < this.currentTournament.teams.length; i++){
                teamService.findOneTeam(this.currentTournament.teams[i])
                    .then(response => {
                                const { _id = response.data._id, name = response.data.name, tag = response.data.tag, owner = response.data.owner, level = response.data.level, ownerAvatar = response.data.ownerAvatar } = response.data
                                this.currentTournamentTeams.push({_id, name, tag, owner, level, ownerAvatar})
                })
            }
            // console.log(this.currentTournamentTeams);

            for (let i = 0; i < this.currentTournament.stage.stage2.length; i++){
                teamService.findOneTeam(this.currentTournament.stage.stage2[i])
                    .then(response => {
                        const { _id = response.data._id, name = response.data.name, tag = response.data.tag, owner = response.data.owner, level = response.data.level, ownerAvatar = response.data.ownerAvatar } = response.data
                                this.stage2Teams.push({_id, name, tag, owner, level, ownerAvatar})
                })
            }

            for (let i = 0; i < this.currentTournament.stage.stage3.length; i++){
                teamService.findOneTeam(this.currentTournament.stage.stage3[i])
                    .then(response => {
                        const { _id = response.data._id, name = response.data.name, tag = response.data.tag, owner = response.data.owner, level = response.data.level, ownerAvatar = response.data.ownerAvatar } = response.data
                                this.stage3Teams.push({_id, name, tag, owner, level, ownerAvatar})
                })
            }

            for (let i = 0; i < this.currentTournament.stage.stage4.length; i++){
                teamService.findOneTeam(this.currentTournament.stage.stage4[i])
                    .then(response => {
                        const { _id = response.data._id, name = response.data.name, tag = response.data.tag, owner = response.data.owner, level = response.data.level, ownerAvatar = response.data.ownerAvatar } = response.data
                                this.stage4Teams.push({_id, name, tag, owner, level, ownerAvatar})
                })
            }
        },

        findTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.thisSelectedTeam = response.data
                    // console.log(this.thisSelectedTeam);
          })
        },

        setActiveTeam(team, index) {
            this.thisTeam = team;
            this.currentIndex = index;
            this.findTeam(this.thisTeam._id)
        },

        setActiveMatch(match, index) {
            this.thisMatch = match
            this.currentMatchIndex = index
          console.log(this.thisMatch);  
        },

        showPopup() {
          this.isPopupVisible = true
        },
        closePopup() {
            this.isPopupVisible = false
            this.thisPlayer = []
        },

        handleEnemyTeam(event) {
          this.enemyTeam = event.target.value
        },
        handleMap(event) {
          this.map = event.target.value
        },
        handleWin(event) {
             if (event.target.checked) {
            this.isWin = event.target.checked
             } else {
            this.isWin = event.target.checked
            }
        },

        kickTeamFromTournament() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            tournamentService.leaveTeamFromTournament(this.$route.params.id, data)
                .then(response => {
                    console.log(response.data);
                    this.currentTournamentTeams = []
                    this.stage2Teams = []
                    this.stage3Teams = []
                    this.stage4Teams = []
                })
                .then(() => {
                    this.getOneTournament(this.$route.params.id)
                })
                .catch(e => {
                    console.log(e);
                })
        },

        goToStage2() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                this.findThisTournamentMatches()
                tournamentService.goToStage2(this.$route.params.id, data)
                    .then(response => {
                        console.log(response.data);
                        this.currentTournamentTeams = []
                        this.stage2Teams = []
                    })
                    .then(() => {
                        this.getOneTournament(this.$route.params.id)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            } else {
                this.createMatch()
                this.findThisTournamentMatches()
            }
        },

        goToStage3() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                this.findThisTournamentMatches()
                tournamentService.goToStage3(this.$route.params.id, data)
                    .then(response => {
                        console.log(response.data);
                        this.currentTournamentTeams = []
                        this.stage2Teams = []
                        this.stage3Teams = []
                    })
                    .then(() => {
                        this.getOneTournament(this.$route.params.id)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            } else {
                this.createMatch()
                this.findThisTournamentMatches()
            }
        },

        goToStage4() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                this.findThisTournamentMatches()
            tournamentService.goToStage4(this.$route.params.id, data)
            .then(response => {
                console.log(response.data);
                this.currentTournamentTeams = []
                this.stage2Teams = []
                this.stage3Teams = []
                this.stage4Teams = []
            })
                .then(() => {
                this.getOneTournament(this.$route.params.id)
                })
                .catch(e => {
                        console.log(e);
                    })
            } else {
                this.createMatch()
                this.findThisTournamentMatches() 
            }
        },

        backToStage1() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            tournamentService.backToStage1(this.$route.params.id, data)
                .then(response => {
                    console.log(response.data);
                    this.currentTournamentTeams = []
                    this.stage2Teams = []
                })
                .then(() => {
                    this.getOneTournament(this.$route.params.id)
                })
                .catch(e => {
                console.log(e);
            })
        },

        backToStage2() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            tournamentService.backToStage2(this.$route.params.id, data)
                .then(response => {
                    console.log(response.data);
                    this.currentTournamentTeams = []
                    this.stage2Teams = []
                    this.stage3Teams = []
                })
                .then(() => {
                    this.getOneTournament(this.$route.params.id)
                })
                .catch(e => {
                console.log(e);
            })
        },

        backToStage3() {
            var data = {
                _id: this.thisSelectedTeam._id
            }
            tournamentService.backToStage3(this.$route.params.id, data)
                .then(response => {
                    console.log(response.data);
                    this.currentTournamentTeams = []
                    this.stage2Teams = []
                    this.stage3Teams = []
                    this.stage4Teams = []
                })
                .then(() => {
                    this.getOneTournament(this.$route.params.id)
                })
                .catch(e => {
                console.log(e);
            })
        },

        createMatch() {
            var data = {
                tournamentId: this.$route.params.id,
                team: ({ teamId: this.thisSelectedTeam._id, teamName: this.thisSelectedTeam.name }),
                enemyTeam: ({ enemyTeamId: this.match.enemyTeam._id, enemyTeamName: this.match.enemyTeam.name }),
                teamRounds: this.match.teamRounds,
                map: this.match.map,
                isWin: this.match.isWin
            }
            matchService.createMatch(data)
            .then(response => {
                console.log(response.data);
            })
                .then(() => {
                    this.match.tournamentId = null,
                        this.match.team = null,
                        this.match.enemyTeam = null,
                        this.match.teamRounds = {},
                        this.match.map = "",
                        this.match.isWin = false
                })
                .catch(e => {
                console.log(e);
            })
        },

        findThisTournamentMatches() {
            matchService.findThisTournamentMatches(this.$route.params.id)
                .then(response => {
                    console.log(response.data);
                    this.matchHistory = response.data
            })
        },
        cleareHistory() {
            matchService.cleareThisTournamentMatches(this.$route.params.id)
                .then(response => {
                    console.log(response.data);
                    this.findThisTournamentMatches()
                })
                .catch(e => {
                console.log(e)
            })
        },
        deleteThisMatch() {
            matchService.deleteThisMatch(this.thisMatch._id)
                .then(response => {
                    console.log(response.data);
                    this.findThisTournamentMatches()
          })  
        },

    },
    mounted() {
        this.getOneTournament(this.$route.params.id) 
        this.findThisTournamentMatches()
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
    },
    created() {
        
    }
}
</script>

<style scoped>

.tournament5v5{
    height: 38em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: roboto;
}
.first-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    box-shadow: 0px 0px 4px 1px #c3073f;
    overflow: auto;
    color: white;
}

.second-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.third-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.fourth-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.teams-first-bracket{
    margin-top: 1.5em;
    width: 100%;
    display: inline-block;
}

.teams-second-bracket{
    margin-top: 4.5em;
    width: 100%;
    display: inline-block;
}

.teams-third-bracket{
    margin-top: 8.5em;
    width: 100%;
    display: inline-block;
}

.teams-fourth-bracket{
    margin-top: 14em;
    width: 100%;
    display: inline-block;
}

.title{
    border-bottom: 1px solid #c3073f;
}

.match-options-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.match-options-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

#icon-star{
    color: #FFD700;
}

.teams{
    margin-top: 0.5em;
    width: 100%;
    display: inline-block;
    color: white;
}
.team-avatar{
    max-width: 2em;
  max-height: 2em;
  border-radius: 66px;
  float: left;
  margin-right: 0.5em;
}

.team-tag{
    float: left;
    color: red;
    margin-right: 0.5em;
}

.team-name{
    float: left;
    margin-right: 0.5em;
}

.team-level{
    float: left;
    margin-right: 0.5em;
}

.team-settings{
    float: right;
}

#popup-team{
    color: white;
    text-align: center;
}

#match-checkbox {
    accent-color: #6f2232;
    margin-left: 6em;
}

#enemy-team{
    margin-left: 0.5em;
    background-color: #222225;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#match-map{
    margin-left: 3em;
    background-color: #222225;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#rounds-win{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    max-width: 4em;
    text-align: center;
    display: inline-block;
    margin-left: 1.3em;
}

#rounds-lose{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    max-width: 4em;
    text-align: center;
    display: inline-block;
    margin-left: 1em;
}

.popup-options{
    text-align: center;
}
.kick{
    margin-right: 1em;
}

.undo {
    margin-right: 1em;
}

.matchHistory-box{
    height: 12em;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1em;
    margin-bottom: 1em;
    color: white;
    background-color: #1a1a1d;
    box-shadow: 0px 0px 12px 0px #c3073f ;
    font-family: roboto;
    overflow: auto;
}

.history-info{
    width: 100%;
    display: inline-block;
    text-align: center;
}

.history-header{
    text-align: center;
    display: inline-block;
}

.history-button{
    float: right;
}

.match-info{
    color: white;
    display: inline-block;
}

.match-history-options{
    display:inline-block
}

.match-delete-button{
    margin-left: 1em;
}

</style>