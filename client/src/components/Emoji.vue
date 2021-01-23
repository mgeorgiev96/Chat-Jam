<template>
    <v-container class='emoji_container rounded cyan' @click="insertEmoji">
            <v-layout row wrap class="text-center pa-3">
                <v-flex sm2>&#128512;</v-flex>
                <v-flex sm2>&#128513;</v-flex>
                <v-flex sm2>&#128514;</v-flex>
                <v-flex sm2>&#128515;</v-flex>
                <v-flex sm2>&#128516;</v-flex>
                <v-flex sm2>&#128517;</v-flex>
                <v-flex sm2>&#128518;</v-flex>
                <v-flex sm2>&#128519;</v-flex>
                <v-flex sm2>&#128520;</v-flex>
                <v-flex sm2>&#128521;</v-flex>
                <v-flex sm2>&#128522;</v-flex>
                <v-flex sm2>&#128523;</v-flex>
                <v-flex sm2>&#128524;</v-flex>
                <v-flex sm2>&#128525;</v-flex>
                <v-flex sm2>&#128526;</v-flex>
                <v-flex sm2>&#128527;</v-flex>
                <v-flex sm2>&#128528;</v-flex>
                <v-flex sm2>&#128529;</v-flex>
                <v-flex sm2>&#128530;</v-flex>
                <v-flex sm2>&#128531;</v-flex>
                <v-flex sm2>&#128532;</v-flex>
                <v-flex sm2>&#128533;</v-flex>
                <v-flex sm2>&#128534;</v-flex>
                <v-flex sm2>&#128535;</v-flex>
                <v-flex sm2>&#128536;</v-flex>
                <v-flex sm2>&#128537;</v-flex>
                <v-flex sm2>&#128538;</v-flex>
                <v-flex sm2>&#128560;</v-flex>
                <v-flex sm2>&#128561;</v-flex>
                <v-flex sm2>&#128563;</v-flex>
                <v-flex sm2>&#128577;</v-flex>
                <v-flex sm2>&#128578;</v-flex>
                <v-flex sm2>&#128580;</v-flex>
                <v-flex sm2>&#129300;</v-flex>
                <v-flex sm2>&#129315;</v-flex>
                <v-flex sm2>&#129321;</v-flex>
                <v-flex sm2>&#129314;</v-flex>
                <v-flex sm2>&#128564;</v-flex>
                <v-flex sm2>&#129296;</v-flex>
                <v-flex sm2>&#128566;</v-flex>
                <v-flex sm2>&#128567;</v-flex>
                <v-flex sm2>&#129297;</v-flex>
            </v-layout>
    </v-container>
</template>

<script>

import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

export default {
    name: 'Emoji',
    setup(props,{root}){
        const insertEmoji = (e)=>{
            let target = e.target
            if(target.classList.contains('sm2') && target.parentElement.parentElement.parentElement.classList.contains('post_controls')){
                root.$store.dispatch('changePostMessage',{action: 'emoji',message:target.innerHTML})
            }else if(target.classList.contains('sm2')){
                root.$store.dispatch('changeChatMessage',{action:'emoji',message:target.innerHTML})
            }
        }
        return {insertEmoji}
    }
}
</script>

<style lang="scss" scoped>
.emoji_container{
    width: 25vw;
    position: absolute;
    display: none;
}
@media all and (min-width:800px){
    .emoji_container{
        width: 18vw;
    }
}
@media all and (min-width:1300px){
    .emoji_container{
        width: 11vw;
    }
}

</style>

