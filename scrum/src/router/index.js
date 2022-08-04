import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from "@/views/LoginView";
//import HomeView from '../views/document.vue'

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
  },
  {
    path: '/TrashManage',
    name: 'TrashManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views//TrashManage')
  },{
    path: '/documentManage',
    name: 'documentManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/documentManage')
  },
  {
    path: '/designManage',
    name: 'designManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/designManage')
  },
  {
    path: '/ProjectTrash',
    name: 'ProjectTrash',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ProjectTrash')
  },
  {
    path: '/document',
    name: 'documentList',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/document')
  },
]

const router = new VueRouter({
  mode:"hash",
  routes
})

export default router
