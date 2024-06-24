<template>
<div class="welcome">
  <h1>ADMIN PANEL</h1>
</div>

<div class="admin-main">
    <div class="row ">
        <div class="col-sm-6 add-tournament">
            <div class="add_form">
                <div class="add_txt">
                <h2>Add Tournament</h2>
                </div>
            <div class="submit-form">
                <div v-if="!submitted">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="tournament-title" required v-model="tournament.title" name="title" />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" class="form-control" id="torunament-description" required v-model="tournament.description" name="description" />
                </div>
                <div class="form-group">
                    <label for="mode">Mode:</label>
                    <select id="tournament-mode" v-model="tournament.mode" @change="handleMode($event)">
                    <option v-for="m in modes" :key="m" :value="m">{{m}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mode">Level:</label>
                    <select id="tournament-level" v-model="tournament.level" @change="handleLevel($event)">
                    <option v-for="l in levels" :key="l" :value="l">{{l}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="slots">Slots:</label>
                    <select id="tournament-slots" v-model="tournament.slots" @change="handleSlots($event)">
                    <option v-for="s in slotsType" :key="s" :value="s">{{s}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="published">Publish:</label>
                    <input id="tournament-checkbox" type="checkbox" v-model="tournament.published" @change="handlePublished($event)"/>
                </div>
                <div class="form-group">
                    <label for="premium">Premium:</label>
                    <input id="tournament-checkbox" type="checkbox" v-model="tournament.premium" @change="handlePremium($event)"/>
                </div>
                <div class="form-group">
                    <label for="startTime">Start time</label>
                <Datepicker id="tournament-date" v-model="tournament.startTime" dark @change="handleDate($event)" />
                </div>
               
                <div class="form-group">
                    <input type="file" accept="image/*" ref="file" class="input-file" @change="selectImage" />
                    <button :disabled="!currentImage" class="add-buttons" @click="upload">Upload</button>
                    <div v-if="currentImage" class="progress">
                        <div
                            class="progress-bar progress-bar-info"
                            role="progressbar"
                            :aria-valuenow="progress"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            :style="{ width: progress + '%' }"
                        >
                            {{ progress }}%
                        </div>
                    </div>
                    <div v-if="previewImage">
                        <div>
                            <img class="preview-image" v-if="currentImage" :src="previewImage" alt="" />
                        </div>
                    </div>
                </div>
                <button @click="saveTournament" class="btn btn-success add-buttons submit-button">Submit</button>
                </div>
                <div class="after_txt" v-if="submitted">
                    <h5>You submitted successfully!</h5>
                    <button class="btn btn-success add-buttons add-next" @click="newTournament">Add next</button>
                </div>
            </div>
            </div>
        </div>

        <div class="col-sm-6 list-tournaments">
            <div class="edit_txt">
                <h2>Edit Tournament</h2>
            </div>

            <div class="tournament-searcher">
        <div class="input-tournament inline">
        <input type="text" class="form-control input-tournament-name" placeholder="Search by title" v-model="searchTitle" />
        </div>
        <div class="input-button inline">
        <button class="btn btn-outline-dark" type="button" @click="filteredTitle">Search</button>
    </div>
        <div class="tournament-pagination inline">
            Items per Page:
            <select class="select-item" v-model="pageSize" @change="handlePageSizeChange($event)">
            <option class="selected-item" v-for="size in pageSizes" :key="size" :value="size"> {{ size }}</option>
            </select>
        <div class="pagination-box inline">
          <div class="pagination-container inline">
            <div class="pagination-wrapper inline">
                <button class="pagination-button" @click="previousPage();"><font-awesome-icon icon="arrow-left" /></button>
            </div>
            <div class="pagination-wrapper inline">
                <button class="pagination-button" @click="nextPage();"><font-awesome-icon icon="arrow-right" /></button>
            </div>
          </div>  
        </div>
    </div>
    </div>
            <div class="tournament-list" 
        :class="{ active: index == currentIndex && isActive}"
        v-for="(tournament,index) in tournaments"
        :key="index"
        @click="setActiveTournament(tournament,index)">
        <div class="row main-row h-100 justify-content-center align-items-center">
            <div class="col-sm-3 startTime">
                {{displayDate(tournament.startTime)}} 
            </div>
            <div class="col-sm-3 title">
                {{tournament.title}}
            </div>
            <div class="col-sm-3 mode">
                {{tournament.mode}}
            </div>
            <div class="col-sm-3 premium">
                {{tournament.premium ? "Premium" : "Free"}}
            </div>
            <transition name="selected-transition">
            <div class="tournament-extend" v-if="currentIndex == index && isActive">
                <button class="edit-button add-buttons" @click="goToEdit()">Edit</button>
            </div>
            </transition>
        </div>

    </div>
    <div class="tournament-list-page">
        Page: {{currentPage + 1}} / {{totalPages}}
    </div>
    <button class="delete-all-button add-buttons" @click="showPopup()">Delete all</button>
    <Popup
      v-show="isPopupVisible"
      @close="closePopup()"
      >
      <template v-slot:header>
      <!-- This is a new modal header. -->
      </template>

      <template v-slot:body>
      <div class="popup-txt">Do you really want to delete all tournaments?</div>
      <button class="add-buttons edit-delete-v2" @click="removeAllTournaments()">DELETE!</button>
      </template>

      <template v-slot:footer>
      <!-- This is a new modal footer. -->
      </template>
    </Popup>
        </div>
    </div>
</div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
import userService from "@/services/user.service";
import moment from "moment"
import Popup from "@/components/Popup.vue";
import uploadFileService from "@/services/uploadFile.service";
export default {
    name: "BoardAdmin-comp",
    components: {
    Popup,
},
    data() {
        return {
            tournament: {
                id: null,
                title: "",
                description: "",
                published: false,
                premium: false,
                startTime: "",
                mode: "",
                level: "",
                slots: "",
                image: "",
            players: [],    
            },
          submitted: false,
            modes: ["1v1", "5v5"],
            levels: ["1-3", "4-7", "8-10"],
            slotsType: ["16","8","4"],
            tournaments: [],
            currentTournament: null,
            currentIndex: -1,
            pageSize: 3,
            pageSizes: [3, 6, 9, 12],
            tournamentsPaginated: [],
            searchTitle: "",
            currentPage: 0,
            totalPages: null,
            totalItems: null,
            thisUser: null, 
            isActive: false,
            isPopupVisible: false,
            selectedFile: null,

            currentImage: undefined,
            previewImage: undefined,
            progress: 0,
            message: "",
            imageInfos: [],

        }
    },
    methods: {
        saveTournament() {
            if (this.currentImage != undefined) {
                for (let i = 0; i < this.imageInfos.length; i++) {
                    if (this.currentImage.name == this.imageInfos[i].name) {
                        this.selectedFile = this.imageInfos[i].url
                        this.tournament.image = this.selectedFile
                    }
                }
            }
            var data = {
                title: this.tournament.title,
                description: this.tournament.description,
              published: this.tournament.published,
                mode: this.tournament.mode,
                level: this.tournament.level,
                slots: this.tournament.slots,
                premium: this.tournament.premium,
                startTime: this.tournament.startTime,
                image: this.tournament.image,
                players: this.tournament.players
            }
            tournamentService.createTournament(data)
                .then(response => {
                    this.tournament.id = response.data.id
                    console.log(response.data)
                    this.submitted = true
                    this.selectedFile = null
                    this.currentImage = undefined
                    this.refreshList()
                })
                .catch(e => {
                console.log(e)
            })
        },
        newTournament() {
            this.submitted = false
            this.tournament = {}
      },
      handleMode(event) {
          this.mode = event.target.value
        },
        handleLevel(event) {
          this.level = event.target.value
        },
        handleSlots(event) {
        this.slots = event.target.value
      },

      getAllTournaments() {
            tournamentService.findAllTournaments(this.currentPage,this.searchTitle, this.pageSize)
                .then((response) => {
                    this.tournamentsPaginated = response.data
                    // console.log(response.data)
                    this.totalPages = this.tournamentsPaginated.totalPages
                    this.tournaments = this.tournamentsPaginated.tournaments
                    this.totalItems = this.tournamentsPaginated.totalItems
                })
                .catch(e => {
                console.log(e)
            })
        },
        nextPage() {
            if (!(this.currentPage === this.totalPages - 1)) {
                this.currentPage++
                this.getAllTournaments()
            }
        },
         previousPage() {
            if (!(this.currentPage === 0)) {
                this.currentPage--
                this.getAllTournaments()
            }
        },
        filteredTitle() {
            this.currentPage = 0
            this.getAllTournaments()
        },
        handlePageSizeChange(event) {
            this.pageSize = event.target.value
            this.page = 0
            this.getAllTournaments()
        },

        refreshList() {
            this.getAllTournaments()
            this.currentTournament = null
            this.currentIndex = -1
        },
        setActiveTournament(tournament, index) {
            this.currentTournament = tournament
            this.currentIndex = index
            this.isActive = !this.isActive
        },
        removeAllTournaments() {
            tournamentService.deleteAllTournaments()
                .then((response) => {
                    console.log(response.data)
                    this.refreshList()
                    this.closePopup()
                })
                .catch(e => {
                console.log(e)
            })
        },
        searchByTitle() {
            tournamentService.findTournamentByTitle(this.searchTitle)
                .then(response => {
                    this.tournaments = response.data
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        joinUserToTournament() {
            tournamentService.addUserToTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },

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

        displayDate(value) {
            if (value) {
                 return moment(String(value)).format('MM/DD/YYYY hh:mm a')
            }
        },
        goToEdit() {
          this.$router.push({name:'tournamentEdit', params: {id: this.currentTournament._id}});
        },
        showPopup() {
          this.isPopupVisible = true
      },
        closePopup() {
          this.isPopupVisible = false
        },
       
        selectImage() {
            this.currentImage = this.$refs.file.files.item(0)
            console.log(this.currentImage.name);
            this.previewImage = URL.createObjectURL(this.currentImage)
            this.progress = 0
            this.message = ""
        },

        upload() {
            this.progress = 0

            uploadFileService.upload(this.currentImage, (event) => {
                this.progress = Math.round((100 * event.loaded) / event.total)
            })
                .then((response) => {
                    console.log(response.data.message)
                return uploadFileService.getFiles()
                })
                .then((images) => {
                this.imageInfos = images.data
                })
                .catch((err) => {
                    this.progress = 0
                    this.message = "Could not upload image!" + err
                    this.currentImage = undefined
            })
        }
     
    },
    mounted() {
        this.getAllTournaments()
        uploadFileService.getFiles().then(response => {
            this.imageInfos = response.data
            console.log(this.imageInfos);
        })
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
    created() {
        // document.body.style.backgroundColor = "#303033"
        var test = document.body;
        test.style.backgroundImage = `url(${require('@/assets/background6.png')})`
  },
}
</script>
<style scoped>

.welcome{
  text-align: center;
  font-family: roboto;
  color: white;
  margin-bottom: 1em;
}

.add-tournament{
    color: white;
    display: flex;
    /* horizontaly */
  justify-content: center;
  /* verticaly */
  /* align-items: center;  */
}

.add_txt{
    margin-bottom: 2em;
}

.add-buttons {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.add-buttons:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

#tournament-title{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#torunament-description{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#tournament-mode{
    margin-left: 1em;
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    float: right;
}

#tournament-level{
    margin-left: 1em;
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    float: right;
}

#tournament-slots{
    margin-left: 1em;
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    float: right;
}

#tournament-checkbox {
    accent-color: #6f2232;
    float: right;
}

/* detepicker */
.dp__theme_dark {
   --dp-background-color: #1a1a1d;
   --dp-border-color: #6f2232;
   --dp-border-color-hover: #6f2232; 
}

.tournament-list{
    height: 6em;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    border-bottom: 2px solid #c3073f;
    background-color: #1a1a1d;
    margin-bottom: 0.2em;
}

.main-row{
    text-align: center;
}

.active{
    background-color: #1a1a1d;
    border: 1px solid #6f2232;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:6px 6px 6px #c3073f;
    height: 8em;
}

.selected-transition-enter-from
.selected-transition-leave-to{
    transform: translateY(20px);
    opacity: 0;
}

selected-transition-enter-active
.selected-transition-leave-active{
    transition: all 0.5s ease-out;
}

.edit_txt{
    color: white;
    margin-bottom: 3.5em;
    text-align: center;
}

.list-tournaments{
    color: white;
}

.delete-all-button{
    margin-top: 2em;
    margin-bottom: 2em;
}

.tournament-searcher{
    margin-bottom: 1em;  
    width: 100%;
}
.input-tournament-name{
    background-color: #1a1a1d;
    color: white;
    border-color: #6f2232;
}
::placeholder{
    color: white;
}
.btn-outline-dark{
    color: white;
    border-color:#6f2232;
    background-color: #1a1a1d;
    margin-left: 1em;
}
 .inline{
    display: inline-block;
 }

 .tournament-pagination{
    float: right;
 }

 .pagination-button{
    border-radius: 100%;
    color: white;
    background-color: #1a1a1d;
    border-color: #6f2232;
    margin-left: 1em;
 }

 .select-item{
    border-radius: 25%;
    color: white;
    background-color: #1a1a1d;
    border-color: #6f2232;
 }

 .tournament-list-page{
    float: right;
 }

.tournament-extend{
    width: 90%;
}

.popup-txt{
  color: white;
  font-family: roboto;
  font-size: 24px;
}


.edit-delete-v2{
    margin-top: 2em;
}

#preview img {
  width: 2em;
  height: 2em;
}

.preview-image{
    width: 2em;
  height: 2em; 
}

.progress{
    margin-top: 0.5em;
}

.progress-bar{
    background-color: #c3073f !important;
}

.submit-button{
    margin-bottom: 1em;
}


</style>