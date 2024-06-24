<template>
<div class="chatButton-switch" v-if="currentUser">
<div class="chatButton" v-if="!$props.openChat">
    <button id="chatB" :class="{'noNotification': !marker, 'notification': marker}" @click="$emit('toggleChat')"><font-awesome-icon size="2x" icon="comment-dots" /></button>
</div>
</div>
<transition name="chat-transition">
<div class="chatbar" v-if="$props.openChat">
<!-- if window chat opened - print all conversation friends -->
{{getConversationFriends()}}
{{newReceiverId()}}
    <div class="chat-container">
        <div class="row h-10">
            <div class="close-chat">
                <button class="chatBarButton" id="close" @click="$emit('toggleChat'); clearConvFriends()">X</button>
            </div>
        </div>
        <div class="row h-90" id="Chat-window" >
            <div class="col-4" id="conversations-list">
                <p>Conversations</p>
                <div>
                    <div 
                    :class="{ active: index == currentIndex, 'noNotification': markerId != friend._id, 'notification': markerId == friend._id }" 
                    v-for="(friend,index) in conversationFriends"
                    :key="index"
                    @click="setActiveConversation(friend, index)">
                    <div class="users-list">
                    <img class="chat-avatar" v-if="friend.faceitAvatar != '' " :src="friend.faceitAvatar" />
                    <img class="chat-avatar" v-if="friend.faceitAvatar == '' || friend.faceitAvatar == undefinied " :src="require('@/assets/unknown.jpg')" />
                    {{friend.username}}
                    <div class="line-broder"></div>
                    </div>

                </div>
            </div>
            </div>
            <div class="col-8" id="right-side-chat-window"> 
                <div class="row h-70" id="messages">
                    <div class="col-12" id="messages-column">
                <span id="noConversation" v-if="!currentChat">Open a conversation to start a chat</span>
                <div v-for="(message,index) in messages"
                :key="index">
                    <div class="currentTexter" v-show="message.sender === thisCurrentUser._id && currentChat">
                        {{message.text}}
                        <div class="date">
                        {{displayDate(message.createdAt)}}
                        </div>
                    </div>
                    <div class="otherTexter" v-show="message.sender !== thisCurrentUser._id && currentChat">
                        {{message.text}}
                        <div class="date">
                        {{displayDate(message.createdAt)}}
                        </div>
                    </div>
                </div>
                    </div>
                </div>
                <div class="row h-20" id="message-input" v-if="currentChat">
                    <div class="col-12">
                        <div class="message-area">
                        <div class="message-a">
                            <textarea class="form-control textarea" id="text-area" v-model="newMessage" rows="3" placeholder="Your message ..." style="background-color: #141417; color: white;" @click="resetMarker()"></textarea>
                        </div>
                        <div class="button-a">
                            <button class="send-message chatBarButton" @click="createMessage(); sendMessageSocket()">Send</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</transition>
</template>

<script>
import userService from "@/services/user.service";
import conversationService from "@/services/conversation.service"
import messageService from "@/services/message.service";
import moment from "moment"
import socketioService from "@/services/socketio.service"
import { chat } from "../store/chat"
export default {
    props: [
        'openChat'
    ],
    emits: [
        "toggleChat"
    ],
    name: "ChatBar-comp",
    data() {
        return {
            thisCurrentUser: [],
            conversations: [],
            conversationFriend: [],
            conversationFriends: [],
            currentChat: null,
            messages: [],
            newMessage: "",
            ownMessages: [],
            messageDate: null,
            thisUser: null,
            currentIndex: -1,
            socket: null,
            arrivalMessage: [],
            receivedId: null,
            marker: false,
            markerId: null
        }
    },
    methods: {
        //get current user
          getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                    // console.log(this.thisCurrentUser)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get current user conversations
        getCurrentUserConversations(id) {
            conversationService.getConversation(id)
                .then(response => {
                    this.conversations = response.data
                // console.log(this.conversations)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get current chat
        getCurrentChat(id1, id2) {
            conversationService.getCommonConversation(id1, id2)
                .then(response => {
                    this.currentChat = response.data
                    this.getMessages(this.currentChat._id)
                    this.scrollToBottom()
                    // console.log(this.currentChat)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get conversation friends ids
        getConversationFriends() {
            //Normal chat opened
            if (chat.myAllConversations.length <= 0) {
                for (var i = 0; i < this.conversations.length; i++) {
                    const friendId = this.conversations[i].members.find((m) => m !== this.currentUser._id)

                    userService.findOneUser(friendId)
                        .then(response => {
                            this.conversationFriend = response.data
                            if (this.conversationFriends.length < this.conversations.length) {
                                this.conversationFriends.push(this.conversationFriend)
                                // console.log(this.conversationFriends)
                            }
                        })
                }
            }
            
            // Chat has been opened from RightSideBar
            if (chat.myAllConversations.length > 0) {
                for (var j = 0; j < chat.myAllConversations.length; j++) {
                    const friendId = chat.myAllConversations[j].members.find((m) => m !== this.currentUser._id)
                    
                    userService.findOneUser(friendId)
                        .then(response => {
                            this.conversationFriend = response.data
                            if (this.conversationFriends.length < chat.myAllConversations.length) {
                                this.conversationFriends.push(this.conversationFriend)
                                this.$watch('receivedId', () => {
                                    this.getCurrentChat(this.receivedId, this.currentUser._id)
                                })
                                this.getCurrentChat(this.receivedId, this.currentUser._id)
                                // console.log(chat.receiverId)
                            }
                        })
                }
            }
        },
        newReceiverId() {
            this.receivedId = chat.receiverId
        },

        clearConvFriends() {
            this.conversationFriends = []
        },

         setActiveConversation(friend, index) {
            this.thisUser = friend
             this.currentIndex = index
             this.getCurrentChat(this.thisUser._id, this.currentUser._id)
             if (this.thisUser._id == this.markerId) {
                 this.markerId = null
                 this.marker = false
             }
        },

        getMessages(id) {
            messageService.getMessage(id)
                .then(response => {
                    this.messages = response.data
                    //AFTER SELECT CURRENT CHAT - SCROLL TO BOTTOM
                    this.$nextTick(function () {
                        this.scrollToBottom()
                     })
            })
        },
        createMessage() {
            var data = {
                sender: this.currentUser._id,
                text: this.newMessage,
                conversationId: this.currentChat._id
            }  
            messageService.createMessage(data)
                .then(response => {
                    // if (chat.myAllConversations.length <= 0) {
                    //     this.getCurrentChat(this.thisUser._id, this.currentUser._id)
                    // } if (chat.myAllConversations.length > 0) {
                    //     this.getCurrentChat(chat.receiverId, this.currentUser._id)
                    // }
                    this.$watch('messages', () => {
                        this.scrollToBottom()
                    })
                    this.getMessages(this.currentChat._id)
                    this.messageDate = response.data.createdAt
                    this.newMessage = ""
                    console.log(response.data)
                })
                
        },

        sendMessageSocket() {
            //check every currentChat memer and if it's this member wchich userId is not equal current user id == our friend
            const receiverId = this.currentChat.members.find((member) => member !== this.currentUser._id)
            socketioService.socket.emit("sendMessage", {
                senderId: this.currentUser._id,
                receiverId,
                text: this.newMessage,
                createdAt: this.messageDate,
                marker: true,
                markerId: this.thisCurrentUser._id
            })
        },

        getMessageSocket() {
            socketioService.socket.on("getMessage", (data) => {
                this.messages.push({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: data.createdAt,
                    marker: data.marker,
                    markerId: data.markerId
                })   
                this.marker = data.marker
                this.markerId = data.markerId
                if (this.$props.openChat) {
                    this.$nextTick(function () {
                        this.scrollToBottom()
                    })
                }       
            })
        },
        changeArrays() {
            if (this.arrivalMessage) {
                console.log('123')
                
                if (this.currentChat.members.includes(this.arrivalMessage.sender)) {
                    this.messages = [...this.messages, this.arrivalMessage]
                    // this.messages((prev) => [...prev, this.arrivalMessage])
                    console.log('321')
                    console.log(this.arrivalMessage)
                    console.log(this.messages)
            }
            }  
        },
        displayDate(value) {
            if (value) {
                 return moment(String(value)).format('MM.DD.YYYY hh:mm a')
            }
        },
        scrollToBottom() {
            var container = document.querySelector(".row.h-70")
            container.scrollTop = container.scrollHeight
            // document.getElementById("messages-column").scrollIntoView({ behavior: 'smooth', block: 'end' })
        },
        resetMarker() {
          if (this.thisUser._id == this.markerId) {
                 this.markerId = null
                 this.marker = false
            }  
            if (chat.receiverId == this.markerId) {
                this.markerId = null
                this.marker = false
            }
            
        },
        log(message) {
            console.log(message)
        },
        testSocket() {
       console.log(socketioService.socket.current);
        },
        addUserSocket() {
            socketioService.socket.emit("addUser", this.currentUser._id)
            socketioService.socket.on("getUsers", () => {  // (users)
                // console.log(users)
            })
        },
    },
    mounted() {
        this.getOneCurrentUser(this.currentUser._id)
        this.getCurrentUserConversations(this.currentUser._id)
        this.addUserSocket()
        this.getMessageSocket()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>

<style>
.chatButton{
    position: fixed;
    top: 42em;
    right: 2em;
   display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 3em;
    height: 3em;
    background-color: rgb(184, 65, 186);  
    z-index: 20;
}

#chatB {
    width:3em;
    height: 3em;
    background-color: #1a1a1d;
    color: white;
    box-shadow:0px 0px 6px 1px white;
}

.chatbar{
    position: fixed;
    top: 22em;
    right: 2em;
   display: flex;
    justify-content: flex-start;
    width: 50em;
    height: 25em;
    z-index: 19; 
    transition: all 300ms ease-in-out;
    background-color: #1a1a1d;
    color: white; 
    box-shadow:0px 0px 6px 1px white;
}

.close-chat{
    width:50em;
    height:2em;
    background-color: #141417;
    color: white;
}

#close{
     float: right;
     color: white;
}

.textarea{
    background-color: #141417;
    color: white;
    border: 1px solid black;
}

/* ::placeholder{
    color: white;
} */


.chatBarButton {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 2px #c3073f) drop-shadow(0 0 4px #c3073f) ;
  transition: .5s;
}

.chatBarButton:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.chat-avatar{ 
  max-width: 2em;
  max-height: 2em;
  border-radius: 66px;
  margin-right: 0.5em;
  cursor: pointer;
}


.line-broder{
    border-bottom: 1px solid white;
    margin-top: 0.5em;
    margin-bottom: 0.5em; 
}


.col-4{
    border-right: 1px solid #000;
}

#noConversation{
    position: absolute;
    top:20%;
    font-size: 48px;
    text-align: center;
    color: rgb(182, 181, 181);
}

.currentTexter{
    text-align: right;
    word-wrap: break-word;
    max-width: 100%;
    margin-left: 50%;
    
}

.otherTexter{
    text-align: left;
    word-wrap: break-word;
    max-width: 50%;
    width: 50%;
}



#message-input{
    text-align: center;
}

.chat-container{
    height: 100%;
    width: 100%;
    max-width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}

.h-10{
    height: 10%;
}

.h-90{
    height: 90%;
}

.h-70{
    overflow-y:scroll;
    overflow-x:hidden;
    height:16em;
}

.h-20{
    height: 20%;
}

.message-area{
    margin-top: 1em;
    width: 100%;
  text-align: center;
}

.message-a{
    width: 80%;
display: inline-block;
  vertical-align: middle;
}

.button-a{
    width: 20%;
display: inline-block;
  vertical-align: middle;
}

.date{
    font-size: 12px;
    color: rgb(200, 200, 200);
}

.notification{
  color: rgb(251, 65, 65) !important;
}

.chat-transition-enter-from,
.chat-transition-leave-to{
    transform: translate3d(20px,20px, 20px);
    opacity: 0;
}

.chat-transition-enter-active
.chat-transition-leave-active{
    transition: all 0.5s ease-out;
}

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

@media (max-width:1500px){
    .chatbar{
    width: 48em;
    height: 24em;
}
.h-70{
        height: 15em;
    }
}

@media (max-width:1400px){
    .chatbar{
    width: 46em;
    height: 24em;
}
}

@media (max-width:1300px){
    .chatbar{
    width: 44em;
    height: 24em;
}
}

@media (max-width:1200px){
    .chatbar{
    width: 42em;
    height: 24em;
}
}

@media (max-width:1300px){
    .chatbar{
    width: 40em;
    height: 24em;
}

    .h-70{
        height: 15em;
    }
}

</style>