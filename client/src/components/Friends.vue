<template>
  <v-card
    class="mx-auto friends_container"
    height="414px"
  >
    <v-card-title class="white--text cyan">
      Friends

      <v-spacer></v-spacer>

      <v-btn
        color="white"
        class="text--primary"
        fab
        small
      >
        <Popup/>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>
    <v-list>
        <v-list-item
        class="my-3 friends_container"
        v-for="friend in getUser.friends"
        :key='friend.id'>
        <v-avatar :color="state.colors[Math.round(Math.random()*5)]" class="font-weight-bold mr-2">{{friend.first_name[0]}}{{friend.last_name[0]}}</v-avatar>
        <v-list-item-title>{{friend.first_name}}</v-list-item-title>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <router-link to='/api/userprofile'>
                        <v-icon :class="friend.id" @click="openProfile(friend.id)"  
                        v-bind="attrs"
                        v-on="on">person</v-icon></router-link>
                    </template>
                    <span>Profile</span>
                </v-tooltip>
                <v-icon :class="friend.id" @click="openChatWindow">message</v-icon>
        </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
import {reactive} from '@vue/composition-api'
import Popup from './Popup'
import axios from 'axios'
export default {
    name: 'Friends',
    components: {Popup},
    computed: mapGetters(['getFriends','getUser','getSelected']),
    methods: {...mapActions(['upSelected','changeViewProfile','changeProfileSelected']),
      openProfile(friend){
        this.changeProfileSelected(friend)
      },
      openChatWindow(e){
        let conversationBox = document.querySelector('.conversation_box')
        let target = e.target
        let friends = document.querySelector('.friends_container')
        let chat = document.querySelector('.chat')
        let attachment = document.querySelector('.attachment')

        chat.style.background = 'rgba(0, 0, 0, 0.7)'
        for(let i =0;i<friends.children[2].children.length;i++){
          friends.children[2].children[i].classList.remove('styled_window')
        }

        target.parentElement.classList.add('styled_window')

        if(conversationBox.classList.length===1){
          conversationBox.classList = [`conversation_box ${target.classList[5]}`]
          attachment.style.display = 'block'
          this.upSelected(false)
        }
          if(conversationBox.classList.contains(target.classList[5])){
            conversationBox.innerHTML = this.getUser.chats.map(chat=>chat.id===target.classList[5] ? chat.chat : '')
          }else{
            conversationBox.innerHTML = this.getUser.chats.map(chat=>chat.id===target.classList[5] ? chat.chat : '')
            conversationBox.classList = [`conversation_box ${target.classList[5]}`]
          }
           for(let i=0;i<conversationBox.children.length;i++){
            if(conversationBox.children[i].classList.contains(this.getUser.username)){
                conversationBox.children[i].classList.add('user_sending')
                conversationBox.children[i].classList.remove('user_sending_back')
            }else{
                conversationBox.children[i].classList.add('user_sending_back')
                conversationBox.children[i].classList.remove('user_sending')
            }
          }
      }
    },
    setup(){
        const state = reactive({
            colors: [
                '#64b5f6',
                '#7986cb',
                '#ff4081',
                '#d1c4e9',
                '#80cbc4',
                '#81c784'
            ]
        })
        return {state}
    }
}
</script>
<style lang='scss' scoped>
a{
  text-decoration: none;
}
.v-icon{
  margin: 0 5px;
}
.friends_container{
    overflow: auto;
    border-radius: 0;
}
.styled_window{
  background: rgba($color: black, $alpha: 0.7);
  box-shadow: 0 0 5px lightgrey;
  transition: 300ms;
  padding-top: 10px;
  padding-bottom: 10px;
  .v-list-item__title,.v-icon{
     color: white!important;
  }
}

</style>