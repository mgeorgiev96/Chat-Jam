<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          class="mr-2"
          v-bind="attrs"
          v-on="on"
        >
          mail_outline
        </v-icon>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Notifications
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item v-for="notification in getUser.notifications" :key='notification.id'>
              <v-list-item-title>Friend Request</v-list-item-title>
              <v-list-item-group>{{notification.notification}}</v-list-item-group>
              <v-icon @click="sendResponse(true,notification.id,notification.username)" class="rounded-pill cyan white--text mx-2 pa-2">check</v-icon>
              <v-icon @click="sendResponse(false,notification.id,notification.username)" class="rounded-pill cyan white--text pa-2">clear</v-icon>
            </v-list-item>
          </v-list>
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
import {mapGetters,mapActions} from 'vuex'
import axios from 'axios'

export default {
    name: 'Notification',
    computed: {...mapGetters(['getUser'])},
    methods: {
      ...mapActions(['changeUserInfo']),
      sendResponse(response,notificationID,user){
        axios.post('/api/request-response',{
          username: this.getUser.username,
          user,
          response,
          notificationID
        }).then(res=>{
          this.changeUserInfo(res.data)
          this.dialog=false

        })
      }
    },data(){
      return{
        dialog: false
        }
    }

}
</script>