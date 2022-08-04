import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from "@/views/LoginView";
//import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,

  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/user',
    name: 'user',
    meta:{
      title:'home',
    },
    component: () => import( '../views/TeamManage.vue')
  },

  {
    path: '/TeamManage',
    name: 'TeamManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TeamManage')
  },
  {
    path: '/ProjectManage',
    name: 'ProjectManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views//ProjectManage')
  }
]

const router = new VueRouter({
  mode:"hash",
  routes
})

export default router
