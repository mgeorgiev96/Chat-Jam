<template>
    <v-card class="chat">
        <v-layout row class="mx-auto mt-2">
                <v-flex xl3 lg3 md3 sm3 xs3 class="friends_box">
                    <Friends/>
                </v-flex>
                <v-flex xl9 lg9 md9 sm9 xs9 class="chat_box pa-1">
                        <ul class="conversation_box">
                        </ul>
                        <div class="wrap-loader">
                            <div class="loading">
                                <div class="bounceball"></div>
                                <div class="text text-uppercase">uploading image...</div>
                            </div>
                        </div>
                </v-flex>
                <v-flex xl12 class="controls white">
                        <v-form @submit.prevent class="float-right px-2 ml-1">
                                <v-text-field :disabled='getSelected'  @input="insertMessage" :value="getChatMessage"  label="Type Here..."></v-text-field>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div class="wrapper">
                                            <input @change='loadImage' type="file" class="attachment"/>
                                            <v-icon
                                            v-bind="attrs"
                                            v-on="on"
                                            :disabled='getSelected'>image</v-icon>
                                        </div>

                                    </template>
                                    <span>Attach</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            @click="showEmoji"
                                            class="mt-6 mx-1"
                                            v-bind="attrs"
                                            v-on="on"
                                            :disabled='getSelected'>insert_emoticon
                                        </v-icon>
                                        <Emoji/>
                                    </template>
                                    <span>Emoji</span>
                                </v-tooltip>
                                <v-tooltip top>
                                   <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        @click='sendMessage'
                                        class="mt-6 mx-1"
                                        v-bind="attrs"
                                        v-on="on"
                                        :disabled='getSelected'>send
                                    </v-icon>
                                </template>
                                <span>Send</span>
                            </v-tooltip>
                        </v-form>
                </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
import Friends from '../components/Friends'
import Emoji from '../components/Emoji'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
import { mapActions, mapGetters } from 'vuex'
import {reactive} from '@vue/composition-api'
import axios from 'axios'
import uniqid from 'uniqid'

export default {
    name: 'Chat',
    components: {Friends,Emoji},
    computed: mapGetters(['getChatMessage','getSocket','getUser','getSelected','getViewProfile']),
    methods: {...mapActions(['changeChatMessage','changeUserInfo','upSelected']),
    loadImage(e){

        let files = e.target.files
        let link = ''
        let conversationBox = document.querySelector('.conversation_box')
        let attachment = document.querySelector('.attachment')
        let spinner = document.querySelector('.wrap-loader')
        this.upSelected(true)
        attachment.style.display = 'none'
        spinner.style.display = 'block'

        if (files.length) {

            // Reject big files
            if (files[0].size > $(this).data("max-size") * 1024) {
                console.log("Please select a smaller file");
                return false;
            }

            // Replace ctrlq with your own API key
            let apiUrl = 'https://api.imgur.com/3/image';
            let apiKey = 'a4be6f93d35ebba';

            let formData = new FormData();
            formData.append("image", files[0]);

            let settings = {
                "async": true,
                "crossDomain": true,
                "url": apiUrl,
                "method": "POST",
                "datatype": "json",
                "headers": {
                    "Authorization": "Client-ID " + apiKey
                },
                "processData": false,
                "contentType": false,
                "data": formData,
                beforeSend: function (xhr) {
                    console.log("Uploading");
                },
                success: function (res) {
                    console.log(res.data.link);
                },
                error: function () {
                    alert("Failed");
                }
            }
            $.ajax(settings).done(function (response) {
                link =  response.data.link
            }).then(()=>{
                conversationBox.innerHTML += `<li class="${this.getUser.username}" ><img src="${link}"/></li>`
                for(let i=0;i<conversationBox.children.length;i++){
                    if(conversationBox.children[i].classList.contains(this.getUser.username)){
                        conversationBox.children[i].classList.add('user_sending')
                        conversationBox.children[i].classList.remove('user_sending_back')
                    }else{
                        conversationBox.children[i].classList.add('user_sending_back')
                        conversationBox.children[i].classList.remove('user_sending')
                }}
                axios.post('/api/save-chat',{
                            chat: conversationBox.innerHTML,
                            username: this.getUser.username,
                            user: conversationBox.classList[1],
                            attachment: true
                }).then(res=>{
                    this.upSelected(false)
                    attachment.style.display = 'block'
                    spinner.style.display = 'none'
                    this.changeUserInfo(res.data)
                })
            });
        }
    },
    listenForEnter(e){
        if(e.keyCode===13){
            this.sendMessage()
        }
    },
    sendMessage(){
        let conversationBox = document.querySelector('.conversation_box')
            if(this.getChatMessage !== ''){
                conversationBox.innerHTML += `<li class="${this.getUser.username}">${this.getChatMessage}</li>`
                for(let i=0;i<conversationBox.children.length;i++){
                if(conversationBox.children[i].classList.contains(this.getUser.username)){
                    conversationBox.children[i].classList.add('user_sending')
                    conversationBox.children[i].classList.remove('user_sending_back')
                }else{
                    conversationBox.children[i].classList.add('user_sending_back')
                    conversationBox.children[i].classList.remove('user_sending')
                }}
                this.upSelected(true)
                axios.post('/api/save-chat',{
                    chat: conversationBox.innerHTML,
                    username: this.getUser.username,
                    user: conversationBox.classList[1],
                    attachment: false,
                }).then(res=>{
                    this.changeUserInfo(res.data)
                    this.upSelected(false)
                    this.changeChatMessage({action:'entry',message:''})
                })
            }
        },
        insertMessage(e){
            this.changeChatMessage({action:'entry',message:e})
        },
        openImage(e){
            let target = e.target
            if(target.classList.contains('uploadImage')){
                window.open(target.src,'_blank')
            }
        }
        },
    setup(props,{root}){
        const showEmoji = (e)=>{
            let target = e.target
            if(target.parentElement.children[4].style.display === 'block'){
                target.parentElement.children[4].style.display = 'none'
            }else{
                target.parentElement.children[4].style.display = 'block'
            }
        }
        return {showEmoji}
    },data(){
        return{
            id: ''
        }
    },created() {
        let uploadImage = document.querySelector(".uploadImage")
        window.addEventListener('click',this.openImage)
        window.addEventListener('keydown',this.listenForEnter)
    }
}
</script>

<style lang='scss'>
@import  url(https://fonts.googleapis.com/css?family=Montserrat);


$width: 15px;
$height: 15px;

$bounce_height: 30px;
.emoji_container{
    width: 25vw;
    position: absolute;
    display: none;
    right: 10px;
    top: -170px;
}

.wrap-loader {
  position: absolute;
  top: 47%;
  left: 61%;
  transform: translate(-50%, -50%) scale(1.3);
  display: none;
}

.text {
  color: #00bcd4;
  display: inline-block;
  margin-left: 5px;
}

.bounceball {
  position: relative;
  display: inline-block;
  height: 37px;
  width: $width;
  &:before {
    position: absolute;
    content: '';
    display: block;
    top: 0;
    width: $width;
    height: $height;
    border-radius: 50%;
    background-color: #00bcd4;
    transform-origin: 50%;
    animation: bounce 500ms alternate infinite ease;
  }
}

@keyframes bounce {
  0% {
    top: $bounce_height;
    height: 5px;
    border-radius: 60px 60px 20px 20px;
    transform: scaleX(2);
  }
  35% {
    height: $height;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: 0;
  }
}
.chat_box{
    overflow: auto;
    box-shadow: 0 0 10px lightgrey;
    border-radius: 5px;
	overflow-y: scroll;
    overflow-x: hidden;
}

.chat_box::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}
.chat_box::-webkit-scrollbar
{
	width: 10px;
	background-color: #F5F5F5;
}

.chat_box::-webkit-scrollbar-thumb
{
	background-color: #80deea;
	background-image: -webkit-gradient(linear, 0 0, 0 100%,
	                   color-stop(.5, rgba(255, 255, 255, .2)),
					   color-stop(.5, transparent), to(transparent));
}
.wrapper{
    position: relative;
    width: 25px;
    height: 25px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    line-height: 1.5rem;
    margin-top: 26px;
    margin-left: 15px;


.attachment{
    height: 100%;
    width: 100%;
    position: absolute;
    opacity: 0;
    z-index: 1;
    display: none;

}
.v-icon{
    align-self: center;
}
}


.chat{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
    height: auto;
    background: white;
    transition: 300ms;
    .chat_box{
        height: 415px;
        overflow: auto;
        overflow-x: hidden;
        word-break: keep-all;
        .conversation_box{
            display: flex;
            flex-flow: column; 
            width: 100%;
            background: rgba($color: black, $alpha: 0);
            list-style: none;
            .user_sending{
                background: #00bcd4;
                color: white;
                border-radius: 5px;
                padding: 12px;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                    border: 1px solid black;
                    float: right;
                    background: black;
                    cursor: pointer;
                }
                a{
                    width: 100px;
                    height: 100px;
                }
                span{
                    border-radius: 45%;
                    background: white;
                    color: black;
                    margin: 4px 7px;
                    padding: 9px;
                    width: 17px;
                    height: 17px;
                }
            }
            .user_sending_back{
                margin-left: 60%;
                background: #eeeeee;
                color: black;
                border-radius: 5px;
                padding: 12px;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                    border: 1px solid black;
                    float: right;
                    background: black;
                    cursor: pointer;
                }
                span{
                    border-radius: 45%;
                    background: #00bcd4;
                    color: white;
                    margin: 4px 7px;
                    padding: 9px;
                    width: 17px;
                    height: 17px;
                }
            }
            li{
                max-width: 40%;
                margin: 5px 0;
            }
        }
    }
    .controls{
        position: relative;
        box-shadow: 0 -4px 4px -3px lightgrey;
        .v-icon{
            width: 30px;
            height: 30px;
        }
        .emoji_btn{
            position: relative;
        }
            .v-form{
                display: flex;
                width: 75%;
    }}
}
.layout{
    width: 100%;
}
</style>