<template>
   <v-container class="profile">
        <div
            class="mx-auto my-12 post_container"
        >
        <v-card v-for='post in getViewProfile.posts' :key='post.id' class="my-6">
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
                                    <v-chip class="cyan white--text title my-5">{{comment.name}}</v-chip>
                                    <div>{{comment.description}}</div>
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
import axios from 'axios'
import uniqid from 'uniqid'

export default {
    name: 'UserProfile',
    computed: mapGetters(['getSelectedPost','getViewProfile','getPostMessage','getProfileSelected','getUser']),
    methods: {...mapActions(['upSelectedPost','changePostMessage','changeViewProfile','changeUserInfo']),
    logProfile(){
        console.log(this.getViewProfiles)
    },
    leaveComment(e){
        let decsription = document.querySelector('.comment_content')
        let target = e.target
        axios.post("/api/leave-comment",{
            loggedUser: this.getUser.username,
            username: target.classList[6],
            user: this.getUser.username,
            postID: target.classList[5],
            commentID: uniqid(),
            description: target.parentElement.children[2].children[0].children[0].children[0].children[1].value,
            name: `${this.getUser.first_name} ${this.getUser.last_name}`
        }).then(res=>{
            this.changeViewProfile(res.data)
        })
    },
    },
    created() {
        axios.post('/api/get-user-profile',{username:this.getProfileSelected}).then(res=>{
            this.changeViewProfile(res.data)
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

.post_image_container{
    height: 500px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transform: scale(0.6);
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