import {createRouter, createWebHistory} from 'vue-router'
import VueCookies from 'vue-cookies'


const router = createRouter({
    history: createWebHistory(),
  routes: [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
      path:'/explorer',
      name: 'Explorer',
      component: () => import('../views/Explorer.vue')
    }
    
  ]
})



export default router

