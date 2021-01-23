<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          color="cyan"
          v-bind="attrs"
          v-on="on"
        >
          mdi-plus
        </v-icon>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Add New Friend
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent='searchFriend(searchCriteria)'>
            <v-text-field v-model="searchCriteria" label="User Email..." required></v-text-field>
            <v-icon @click="searchFriend(searchCriteria)">search</v-icon>
          </v-form>
        </v-card-text>
        <v-card-text class="search_box" @click="sendRequest">
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
import {reactive} from '@vue/composition-api'
import axios from 'axios'
import {mapGetters} from 'vuex'

export default {
    name: 'Popup',
    computed: mapGetters(['getUser']),
    methods: {
      sendRequest(e){
          let target = e.target
          if(target.classList.contains('fa-user-plus')){
            axios.post('/api/send-request',{username:this.searchCriteria,user:this.getUser.username}).then(res=>{
              let searchBox = document.querySelector('.search_box')
              searchBox.innerHTML = ''
              this.searchCriteria = ''
              this.dialog = false
            })
          }
      },
      searchFriend(search){
        let c = 0
        this.getUser.friends.map(friend=>friend.id===this.searchCriteria? c++ : '')

        axios.post('/api/friend-search',{username:search}).then(res=>{
            let searchBox = document.querySelector('.search_box')
            if(c>0){
              searchBox.innerHTML = `<p>You are already friends with <strong>${this.searchCriteria}</strong>.</p>`
            }else if(res.data.username!=='' &&  res.data.username!==this.getUser.username){
               searchBox.innerHTML = `<p class='cyan white--text rounded mx-auto pa-2'>${res.data.username}<i class="fas fa-user-plus ml-2"></i></p>`
            }else{
              searchBox.innerHTML = `<p>Account with email <strong>${this.searchCriteria}</strong> not found.</p>`
            }}
        )}
    },
    data(){
      return {
            dialog: false,
            searchCriteria: ''
      }
    }
}
</script>

<style lang="scss" scoped>
.v-form{
  display: flex;
}
.search_box{
  display: flex;
  justify-content: center;
}
</style>