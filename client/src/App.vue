<template>
  <v-app class="app_container cyan lighten-5">
    <v-layout row wrap class="chat_container">
      <v-flex xl8 lg9 md10 sm11 xs11 class="mx-auto pa-4 mt-16">
              <Navigation/>
              <v-divider></v-divider>
              <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation.vue';


export default {
  components: { Navigation },
  name: "App",
};
</script>
<style lang='scss'>
.app_container{
  font-family: 'Do Hyeon', sans-serif !important;
  background: #e0f7fa !important;
  overflow: hidden;
}
</style>
