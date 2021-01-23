import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: '/api/home',
    name: 'Home',
    component:()=> import('../views/Home.vue')
  },
  {
    path: '/api/chats',
    name: 'Chat',
    component: ()=> import('../views/Chat.vue')
  },
  {
    path: '/api/profile',
    name: 'Profile',
    component: ()=> import('../views/Profile.vue')
  },
  {
    path: '/api/userprofile',
    name: 'UserProfile',
    component: ()=> import('../views/UserProfile.vue')
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
