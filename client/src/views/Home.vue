<template>
 <v-container>
     <v-layout class="home text-center" row>
         <v-flex xs12 class="text-center mt-16"><img class="logo_image mx-auto" src="../assets/images/logo_remaked.png" alt="logo"></v-flex>
         <h1 class="text-center mx-auto white--text">The lighter way to enjoy chatting</h1>
     </v-layout>
 </v-container>
</template>
    
<script>
export default {
    name:'Home'
}
</script>

<style lang='scss' scoped>
.v-container{
    width: 100%;
}
.home{
    box-shadow: 0 0 10px lightgrey;
    height: 500px;
    position: relative;
    border-radius: 5px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    font-family: 'Righteous', cursive !important;
    background: rgba(0,0,0,0.8);
    img{
        transform: scale(1.5);
    }
    h1{
        font-size: 3rem;
    }
}
</style>