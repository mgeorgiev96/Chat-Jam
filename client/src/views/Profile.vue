<template>
   <v-container class="profile">
            <div class="text-center">
                <v-dialog
                v-model="dialog"
                width="500"
                >
                
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="cyan white--text float-left"
                    v-bind="attrs"
                    v-on="on"
                    >
                    New Post<v-icon class="ml-2">mdi-plus</v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title class="headline grey lighten-2">
                    Create Post
                    </v-card-title>
                        <div class="wrap-loader">
                            <div class="loading">
                                <div class="bounceball"></div>
                                <div class="text text-uppercase">posting...</div>
                            </div>
                        </div>
                    <v-card-text>
                        <v-form>
                            <v-text-field required v-model="postTitle" label='Title...'></v-text-field>
                            <v-textarea @input='sendMessage' required :value="getPostMessage" label='Description...' class="description_text"></v-textarea>
                            <div class="post_controls">
                                 <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <input
                                                    type="file"
                                                    class="attachment mx-2 mt-5"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    accept="image/*"
                                                    label="File input"
                                                    @change="loadImage"
                                                    :disabled='getSelectedPost'
                                            />
                                        </template>
                                        <span>Attach</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }" class="emoji_post_container">
                                            <v-icon
                                                @click="showEmoji"
                                                class="mt-6 mx-1 float-right"
                                                v-bind="attrs"
                                                v-on="on"
                                                >insert_emoticon
                                            </v-icon>
                                            <Emoji/>
                                        </template>
                                        <span>Emoji</span>
                                    </v-tooltip>
                            </div>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="cyan white--text"
                        :disabled='getSelectedPost'
                        @click="loadPost"
                    >
                        Post
                    </v-btn>
                    <v-btn
                        color="cyan"
                        text
                        @click="dialog = false"
                    >
                        Close
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </div>
        <div
            class="mx-auto my-12 post_container"
        >
        <v-card v-for='post in getUser.posts' :key='post.id' class="my-6">
            <template slot="progress">
            <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
            ></v-progress-linear>
            </template>

            <v-container v-if="post.image" v-bind:style="{backgroundImage:`url(${post.image})`}"
            class="post_image_container rounded-pill"
            ></v-container>

            <v-card-title>{{post.name}}</v-card-title>

            <v-card-title>{{post.title}}</v-card-title>

            <v-card-text>
                {{post.description}}
            </v-card-text>

            <v-card-actions>
                <template>
                    <v-expansion-panels>
                        <v-expansion-panel>
                        <v-expansion-panel-header>
                            Comments
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-form class="comment_form">
                                <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon
                                             @click="leaveComment"
                                             v-bind="attrs"
                                             v-on="on"
                                             :class="`${post.id} ${post.username} ${post.name}`">chat_bubble_outline</v-icon>
                                        </template>
                                        <span>Post</span>
                                </v-tooltip>
                                <v-textarea class="comment_content" label='Comment...' required></v-textarea>
                            </v-form>
                            <v-list>
                                <v-list-item v-for="comment in post.comments" :key='comment.id' class="post_comment my-2 rounded">
                                    <v-chip class="cyan white--text title pa-2 my-4">{{comment.name}}</v-chip>
                                    <div class="ml-4">{{comment.description}}</div>
                                </v-list-item>
                            </v-list>
                        </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </template>
            </v-card-actions>
            </v-card>
        </div>
   </v-container>
</template>

<script>

import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
import {reactive} from '@vue/composition-api'
import {mapGetters,mapActions} from 'vuex'
import Emoji from '../components/Emoji'
import axios from 'axios'
import uniqid from 'uniqid'

export default {
    name: 'Profile',
    components: {Emoji},
    computed: mapGetters(['getSelectedPost','getUser','getPostMessage']),
    methods: {...mapActions(['upSelectedPost','changePostMessage','changeUserInfo','changeUserInfo']),
    leaveComment(e){
        let decsription = document.querySelector('.comment_content')
        let target = e.target
        axios.post("/api/leave-comment",{
            username: this.getUser.username,
            user: target.classList[6],
            postID: target.classList[5],
            commentID: uniqid(),
            description: target.parentElement.children[2].children[0].children[0].children[0].children[1].value,
            name: `${target.classList[7]} ${target.classList[8]}`
        }).then(res=>{
            this.changeUserInfo(res.data)
        })
    },
    sendMessage(){
        let descriptionText = document.querySelector('.description_text')
        this.changePostMessage({message:descriptionText.children[0].children[0].children[0].children[1].value,action:'entry'})
    },
    loadImage(e){
        this.postImage = e.target.files
    },
    loadPost(e){

        let files = this.postImage
        let link = ''
        let conversationBox = document.querySelector('.conversation_box')
        let spinner = document.querySelector('.wrap-loader')
        this.upSelectedPost(true)
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
                axios.post('/api/save-post',{
                    username: this.getUser.username,
                    image: link,
                    title: this.postTitle ,
                    description: this.getPostMessage,
                    id: uniqid(),
                    comments: [],
                    name: `${this.getUser.first_name} ${this.getUser.last_name}`
                }).then((res)=>{
                    this.upSelectedPost(false)
                    this.dialog = false
                    this.changeUserInfo(res.data)
                    spinner.style.display = 'none'
                })
            })
        }else{
                axios.post('/api/save-post',{
                    username: this.getUser.username,
                    title: this.postTitle ,
                    description: this.getPostMessage,
                    id: uniqid(),
                    comments: [],
                    name: `${this.getUser.first_name} ${this.getUser.last_name}`
                }).then((res)=>{
                    this.upSelectedPost(false)
                    this.dialog = false
                    this.changeUserInfo(res.data)
                    spinner.style.display = 'none'
                })
        }
    }},
    data(){
        return {
            postTitle: '',
            postImage: '',
            dialog: '',
            commentDescription: ''
        }
    },
    setup(){
        const showEmoji = (e)=>{
            let target = e.target
            if(target.parentElement.children[3].style.display === 'block'){
                target.parentElement.children[3].style.display = 'none'
            }else{
                target.parentElement.children[3].style.display = 'block'
            }
        }
        return {showEmoji}
    },created() {
        axios.get('/api/info').then(res=>{
            this.changeUserInfo(res.data)
        })
    },
}
</script>

<style lang="scss" scoped>
$width: 15px;
$height: 15px;

$bounce_height: 30px;


.post_comment{
    box-shadow: 0 0 5px lightgrey;
    display: inline-block;
    width: 100%;
    .v-chip{
        min-width: 115px;
    }
}
.post_image_container{
    height: 500px;
    width: 500px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transform: scale(0.7);
    border: 1px solid black;
}

.emoji_container{
    top: 150px;
    background: #00bcd4;
    opacity: 1;
    right: 10px;
}
.emoji_comment_container{
    .emoji_container{
    top: 150px;
    background: #00bcd4;
    opacity: 1;
    
}
}

.wrap-loader {
  position: absolute;
  top: 47%;
  left: 48%;
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
.profile{
    height: 600px;
    overflow: auto;
    box-shadow: 0 0 10px lightgrey;
    border-radius: 5px;
	overflow-y: scroll;
    overflow-x: hidden;
    background: rgba(0,0,0,0.8);
}
.post_container{
    width: 40%;
    background: rgba($color: #000000, $alpha: 0);
}

.profile::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}
.profile::-webkit-scrollbar
{
	width: 10px;
	background-color: #F5F5F5;
}

.profile::-webkit-scrollbar-thumb
{
	background-color: #80deea;
	background-image: -webkit-gradient(linear, 0 0, 0 100%,
	                   color-stop(.5, rgba(255, 255, 255, .2)),
					   color-stop(.5, transparent), to(transparent));
}

@media all and (max-width:1200px){
    .post_container{
        width: 80%;
    }
}
@media all and (min-width:1210px){
    .post_container{
        width: 60%;
    }
}
@media all and (min-width:1600px){
    .post_container{
        width: 40%;
    }
}

</style>