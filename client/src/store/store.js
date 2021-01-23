import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        user: '',
        selected: true,
        selectedPost: false,
        socket: io.connect('http://localhost:5000'),
        chatMessage: '',
        postMessage: '',
        commentMessage: '',
        viewProfile: '',
        profileSelected: ''
    },
    actions: {
        upSelected({commit},bool){
            commit('updateSelected',bool)
        },
        upSelectedPost({commit},bool){
            commit('updateSelectedPost',bool)
        },
        changeChatMessage({commit},message){
            commit('chatMessageSave',message)
        },
        changePostMessage({commit},message){
            commit('postMessageSave',message)
        },
        changeCommentMessage({commit},message){
            commit('commentMessageSave',message)
        },
        changeUserInfo({commit},user){
            commit('newUserInfo',user)
        },
        changeViewProfile({commit},user){
            commit('newViewProfile',user)
        },
        changeProfileSelected({commit},email){
            commit('profileSelected',email)
        }
    },
    mutations: {
        profileSelected(state,email){
            state.profileSelected = email
        },
        updateSelectedPost(state,bool){
            state.selectedPost = bool
        },
        updateSelected(state,bool){
            state.selected = bool
        },
        newUserInfo(state, user){
            state.user = user
        },
        newViewProfile(state,user){
            state.viewProfile = user
        },
        chatMessageSave(state,message){
            if(message.action === 'emoji'){
                state.chatMessage += message.message
            }else{
                state.chatMessage = message.message
            }
        },
        postMessageSave(state,message){
            if(message.action === 'emoji'){
                state.postMessage += message.message
            }else{
                state.postMessage = message.message
            }
        },
        commentMessageSave(state,message){
            if(message.action === 'emoji'){
                state.commentMessage += message.message
            }else{
                state.commentMessage = message.message
            }
        }
    },
    getters: {
        getChatMessage: state=>{
            return state.chatMessage
        },
        getPostMessage: state=>{
            return state.postMessage
        },
        getSocket: state=>{
            return state.socket
        },
        getUser: state=>{
            return state.user
        },
        getSelected: state=>{
            return state.selected
        },
        getSelectedPost: state=>{
            return state.selectedPost
        },
        getCommentMessage: state=>{
            return state.commentMessage
        },
        getViewProfile: state=>{
            return state.viewProfile
        },
        getProfileSelected: state=>{
            return state.profileSelected
        }
    }
})