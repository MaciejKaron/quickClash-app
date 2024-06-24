<template>
  <div class="edit-tournament-main">
    <div v-if="currentTournament" class="edit-form">
    <h2 class="welcome-txt">Edit Tournament</h2>
    <form>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title-edit" v-model="currentTournament.title" />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description-edit" v-model="currentTournament.description" />
      </div>
      <div class="form-group">
          <label for="mode">Mode:</label>
          <select id="mode-edit" v-model="currentTournament.mode" @change="handleMode($event)">
            <option v-for="m in modes" :key="m" :value="m">{{m}}</option>
          </select>
      </div>
      <div class="form-group">
        <label><strong>Public status:</strong></label>
        {{ currentTournament.published ? "Published" : "Pending" }}
      </div>
      <div class="form-group">
        <label for="published">Publish:</label>
        <input id="checkbox-edit" type="checkbox" v-model="currentTournament.published" @change="handlePublished($event)"/>
      </div>
      <div class="form-group">
        <label><strong>Premium status:</strong></label>
        {{ currentTournament.premium ? "Premium" : "Free" }}
      </div>
      <div class="form-group">
        <label for="premium">Premium:</label>
        <input id="checkbox-edit" type="checkbox" v-model="currentTournament.premium" @change="handlePremium($event)"/>
      </div>
      <div class="form-group">
        <label for="startTime">Start time</label>
        <Datepicker id="tournament-date" v-model="currentTournament.startTime" dark @change="handleDate($event)" />
      </div>
    </form>
    <!-- <button class="badge badge-primary mr-2"
      v-if="currentTournament.published"
      @click="updateToPublished(false)"
    >
      UnPublish
    </button> -->
    <div class="tournament-edit-options">
    <button class="tournament-edit-delete"
      @click="showPopup()"
    >
      Delete
    </button>

    <Popup
      v-show="isPopupVisible"
      @close="closePopup()"
      >
      <template v-slot:header>
      <!-- This is a new modal header. -->
      </template>

      <template v-slot:body>
      <div class="popup-txt">Do you really want to delete this tournament?</div>
      <button class="tournament-edit-delete edit-delete-v2" @click="deleteThisTournament()">DELETE!</button>
      </template>

      <template v-slot:footer>
      <!-- This is a new modal footer. -->
      </template>
    </Popup>

    <button type="submit" class="tournament-edit-update"
      @click="updateThisTournament"
    >
      Update
    </button>
    <button type="submit" class="tournament-edit-return"
      @click="goReturn()"
    >
      Return
    </button>
    </div>
    <p class="update-message">{{ message }}</p>
  </div>
</div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
import Popup from "@/components/Popup.vue";
export default {
  name: "TournamentEdit-comp",
  components: {
    Popup,
},
    data() {
        return {
          currentTournament: null,
          message: "",
          modes: ["1v1", "5v5"],
          isPopupVisible: false,
        }
    },
    methods: {
        getOneTournament(id) {
            tournamentService.findOneTournament(id)
                .then(response => {
                    this.currentTournament = response.data
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        updateToPublished(status) {
            var data = {
                id: this.currentTournament._id,
                title: this.currentTournament.title,
                description: this.currentTournament.description,
                published: status
            }
            tournamentService.updateTournament(this.currentTournament._id, data)
                .then(response => {
                    this.currentTournament.published = status
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        updateThisTournament() {
            tournamentService.updateTournament(this.currentTournament._id, this.currentTournament)
                .then(response => {
                    console.log(response.data)
                this.message = "Tournament was updated successfully!"
                })
                .catch(e => {
                console.log(e)
            })
        },
        deleteThisTournament() {
            tournamentService.deleteTournament(this.currentTournament._id)
                .then(response => {
                    console.log(response.data)
                    this.goReturn()
                })
                .catch(e => {
                console.log(e)
            })
      },
      handleMode(event) {
          this.mode = event.target.value
      },
      handlePublished(event) {
            if (event.target.checked) {
            this.published = event.target.checked
            } else {
            this.published = event.target.checked
          }  
      },
      handlePremium(event) {
             if (event.target.checked) {
            this.premium = event.target.checked
             } else {
            this.premium = event.target.checked
            }
      },
      handleDate(event) {
            this.startTime = event.target.value
            // console.log(event.target.value)
            // console.log(this.startTime)
      },
      goReturn() {
          this.$router.push({name:'admin'});
      },
      showPopup() {
          this.isPopupVisible = true
      },
      closePopup() {
          this.isPopupVisible = false
        }
    },
    mounted() {
        this.message = ""
        this.getOneTournament(this.$route.params.id)
  },
  created() {
        document.body.style.backgroundColor = "#303033"
  },
}
</script>

<style scoped>
.edit-tournament-main{
  color: white;
  display: flex;
    /* horizontaly */
  justify-content: center;
  /* verticaly */
  align-items: center;
}

.welcome-txt{
  margin-top: 1em;
  margin-bottom: 1em;
}

#title-edit{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#description-edit{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#mode-edit{
    margin-left: 1em;
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    float: right;
}

#checkbox-edit {
    accent-color: #6f2232;
    float: right;
}

/* detepicker */
.dp__theme_dark {
   --dp-background-color: #1a1a1d;
   --dp-border-color: #6f2232;
   --dp-border-color-hover: #6f2232; 
}

.tournament-edit-delete {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.tournament-edit-delete:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.tournament-edit-update {
  margin-left: 1.2em;
  background-color: #214611;
  color: white;
  border: 2px solid #275214;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #2c5e17) drop-shadow(0 0 8px #2c5e17) ;
  transition: .5s;
}

.tournament-edit-update:hover {
  color: white;
  background-color: #2c5e17;
  filter: drop-shadow(0 0 6px #275214);
}

.tournament-edit-return {
  margin-left: 1.2em;
  background-color: #063158;
  color: white;
  border: 2px solid #073a67;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #084276) drop-shadow(0 0 8px #084276) ;
  transition: .5s;
}

.tournament-edit-return:hover {
  color: white;
  background-color: #084276;
  filter: drop-shadow(0 0 6px #073a67);
}

.update-message{
  margin-top: 1em;
  color: white;
  -webkit-box-shadow:0px 1px 1px #950740;
  -moz-box-shadow:0px 0px 1px #950740;
   box-shadow: 2px 2px 4px #c3073f;
}

.popup-txt{
  color: white;
  font-family: roboto;
  font-size: 24px;
}

.edit-delete-v2{
  margin-top: 2em;
}

</style>