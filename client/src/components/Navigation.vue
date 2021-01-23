<template>
  <v-card class="cyan lighten-3">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold white--text py-6">
        Hello Martin
      </h1>
    </v-card-title>

    <v-tabs
      v-model="state.tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab class="pt-2"
        v-for="item in state.menu"
        :key="item.name"
        :to="item.route"
      >
        <v-icon class="mr-2">{{item.icon}}</v-icon>{{ item.name }}
      </v-tab>
      <v-tab class="pt-2">
        <v-badge
          color="red"
          :content="getUser.notifications? getUser.notifications.length: '0'"
        >
        <Notification/>
        </v-badge>
      </v-tab>
      <v-tab @click="logoutAccount" class="pt-2">
        <v-icon class="mr-2">exit_to_app</v-icon>Logout
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="state.tab">
      <v-tab-item
        v-for="item in state.menu"
        :key="item.name"
      >
        <v-card
          color="basil"
          flat
        >

        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)
import {reactive} from '@vue/composition-api'
import axios from 'axios'
import Notification from './Notification'
import {mapActions, mapGetters} from 'vuex'

export default {
    name: 'Navigation',
    components: {Notification},
    computed: mapGetters(['getUser']),
    methods: {...mapActions(['changeUserInfo'])},
    setup(props,{root}){
      const logoutAccount = ()=>{
        axios.get('/api/logout').then(()=>window.location.replace('/'))
      }
        const state = reactive({
            tab: null,
            menu: [
                {
                    name: 'Home',
                    route: '/api/home',
                    icon: 'dashboard'
                },
                {
                    name: 'Chats',
                    route: '/api/chats',
                    icon: 'chat'
                },
                {
                    name: 'Profile',
                    route: '/api/profile',
                    icon: 'person'
                }
            ]
        })
        return {state,logoutAccount}
    },
    created() {
      axios.get('/api/info').then(res=>{
            this.changeUserInfo(res.data)
        })
    },
}
</script>

<style lang="scss" scoped>
h1{
  font-size: 4rem;
  font-family: 'Righteous', cursive !important;
}
a{
  text-decoration: none;
}
</style>
