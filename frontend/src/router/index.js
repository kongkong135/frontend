import {createRouter, createWebHistory} from 'vue-router'
import VueCookies from 'vue-cookies'

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Explorer from '../views/Explorer.vue';
import Admin from '../views/Admin.vue';

import PhotoDetail from '../views/PhotoDetail.vue';
import SharePhoto from '../components/SharePhoto.vue';

import Chat from '../components/Chat.vue';

const router = createRouter({
      history: createWebHistory(),
       routes: [
    {
        path: '/',
        name: 'Home',
        component: Home

    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
      path:'/explorer',
      name: 'Explorer',
      component:Explorer
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },

    {
      path: '/chat/:friendId',
      name: 'Chat',
      component: Chat,
      props: true
    },
    {
      path: '/photo-detail/:photoId',
      name: 'PhotoDetail',
      component: PhotoDetail,
      props: true
    },
    {
      path: '/share-photo/:photoId',
      name: 'SharePhoto',
      component: SharePhoto,
      props: true
    },


    
  ]
})



export default router

